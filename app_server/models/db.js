const mongoose = require('mongoose');
const readLine = require('readline');

const dbURI = 'mongodb://localhost/Loc8r';
mongoose.connect(dbURI, { useNewUrlParser: true });

mongoose.connection.on('connected', () => console.log(`Mongoose connected to  ${dbURI}`));
mongoose.connection.on('error', err => console.log('Mongoose connection error:', err));
mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'));

if (process.platform === 'win32') {
    const r1 = readLine.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    r1.on('SIGINT', () => process.emit("SIGINT"));
    r1.on('SIGUSR2', () => process.emit('SIGUSR2'));
    r1.on('SIGTERM', () => process.emit('SIGTERM'));   
}

const gracefulShutdown = (msg, callback) => mongoose.connection.close(() => {
    console.log(`Mongoose disconnected through ${msg}`);
    callback();
});

process.once('SIGUSR2', () => gracefulShutdown('nodemon restart', () => process.kill(process.pid, 'SIGUSR2')));
process.on('SIGINT', () => gracefulShutdown('app termination', () => process.exit(0)));
process.on('SIGTERM', () => gracefulShutdown('Heroku app shutdown', () => process.exit(0)));