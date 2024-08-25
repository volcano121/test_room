const express = require('express');
const path = require('path');
const findProcess = require('find-process');
const treeKill = require('tree-kill');

const PORT = process.env.PORT || 3000;

const app = express();

// ������������ ����������� ������ �� ����� public
app.use(express.static(path.join(__dirname)));

// ������������ ����� index.html �� �������� ����� �������
app.get('/', (req, res) => {
    console.log('Serving index.html from root directory');
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ������� ��� ����������� �������
const startServer = () => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

// �������� � ���������� ��������, ������������� ���� 3000
findProcess('port', PORT)
    .then((list) => {
        if (list.length > 0) {
            console.log(`Port ${PORT} is in use by PID ${list[0].pid}. Terminating process...`);
            treeKill(list[0].pid, 'SIGKILL', (err) => {
                if (err) {
                    console.log('Error terminating process:', err);
                } else {
                    console.log('Process terminated successfully.');
                    startServer(); // ������ ������� ����� ���������� ��������
                }
            });
        } else {
            startServer(); // ������ �������, ���� ���� ��������
        }
    })
    .catch((err) => {
        console.log('Error finding process:', err);
    });
