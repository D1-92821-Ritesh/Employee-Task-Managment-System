const fs = require('fs');
console.log('Writing to test_fs.txt');
try {
    fs.writeFileSync('test_fs.txt', 'Hello fs!');
    console.log('Write successful');
} catch (e) {
    console.error('Write failed:', e);
}
