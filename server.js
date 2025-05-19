const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DATA_PATH = path.join(__dirname, 'data', 'letters.json');

// 获取所有信件
app.get('/api/letters', (req, res) => {
    if (!fs.existsSync(DATA_PATH)) fs.writeFileSync(DATA_PATH, '[]');
    const data = fs.readFileSync(DATA_PATH, 'utf8');
    res.json(JSON.parse(data));
});

// 提交新信件
app.post('/api/letters', (req, res) => {
    const letters = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    const newLetter = {
        message: req.body.message,
        reply: null,
        time: new Date().toLocaleString()
    };
    letters.push(newLetter);
    fs.writeFileSync(DATA_PATH, JSON.stringify(letters, null, 2));
    res.json({ success: true });
});

// 保存回复
app.post('/api/reply/:id', (req, res) => {
    const letters = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    const id = parseInt(req.params.id);
    if (letters[id]) {
        letters[id].reply = req.body.reply;
        fs.writeFileSync(DATA_PATH, JSON.stringify(letters, null, 2));
        res.json({ success: true });
    } else {
        res.status(404).json({ error: '信件不存在' });
    }
});

app.listen(PORT, () => {
    console.log(`✅ 网站已运行：http://localhost:${PORT}`);
});
