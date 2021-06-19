const axios = require('axios');
const path = require('path');
const fs = require('fs');

const bearer = 'Q3dndG9JRO8AAAAAAAAAAWs2_QzIcUDrhEWW6Ozs79rwUa0sYmkFAFo23CHq5f-G';
const fileName = 'test.txt'
const filePath = path.join(__dirname, fileName);
const dropboxFilePath = '/api_testing/test.txt';

test('Upload file', () => {
    const testFile = fs.readFileSync(filePath);

    const dropboxAPIArg = {
        path: dropboxFilePath,
        mode: 'add',
        autorename: true,
        mute: false,
        strict_conflict: false
    }
    return axios.post('https://content.dropboxapi.com/2/files/upload',
        testFile,
        {
            headers: {
                'Authorization': `Bearer ${bearer}`,
                'Dropbox-API-Arg': JSON.stringify(dropboxAPIArg),
                'Content-Type': 'application/octet-stream'
            }
        },
    )
        .then((response) => {
            expect(response.status).toBe(200);
            expect(response.data.name).toBe(fileName);
            expect(response.data.path_lower).toBe(dropboxFilePath);
        }, (error) => {
            console.log(error);
        });
});


test('Get file metadata', () => {
    const data = {
        path: dropboxFilePath,
        include_media_info: false,
        include_deleted: false,
        include_has_explicit_shared_members: false
    }

    return axios.post('https://api.dropboxapi.com/2/files/get_metadata',
        data,
        {
            headers: {
                'Authorization': `Bearer ${bearer}`,
                'Content-Type': 'application/json'
            }
        },
    )
        .then((response) => {
            expect(response.status).toBe(200);
            expect(response.data.name).toBe(fileName);
            expect(response.data.path_lower).toBe(dropboxFilePath);
            expect(response.data['.tag']).toBe('file');
        }, (error) => {
            console.log(error);
        });
});


test('Delete file', () => {
    const data = {
        path: dropboxFilePath
    }

    return axios.post('https://api.dropboxapi.com/2/files/delete_v2',
        data,
        {
            headers: {
                'Authorization': `Bearer ${bearer}`,
                'Content-Type': 'application/json'
            }
        },
    )
        .then((response) => {
            expect(response.status).toBe(200);
            expect(response.data.metadata.name).toBe(fileName);
            expect(response.data.metadata.path_lower).toBe(dropboxFilePath);
            expect(response.data.metadata['.tag']).toBe('file');
        }, (error) => {
            console.log(error);
        });
});
