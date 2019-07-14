/*
Copyright (c) 2019 Matt Worzala <bhop.me>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// A simple JSON based config system. Subject to change in the future if needed.

const { app, ipcMain } = require('electron');
const os = require('os');
const fs = require('fs-extra');
const path = require('path');
const Database = require('../app/database');

const baseDir = app.getPath('userData');
const config = new Database(path.join(baseDir, 'config.db'));
const configFile = path.join(baseDir, 'launcher_config.json');

let saveTask = null;
let listeners = {};

app.on('ready', async () => {
    ipcMain.on('config:get', async (event, args) => event.returnValue = await this.getValue(args));
    ipcMain.on('config:set', async (event, args) => await this.setValue(args.path, args.value));
    ipcMain.on('config:save', () => this.saveConfig());

    if (!await config.findOne({})) {
        console.log('Writing default config settings');
        await config.insert({ key: 'clientKey', value: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) });
        await config.insert({ key: 'app/instanceDir', value: path.join(baseDir, 'Instances') });
        await config.insert({ key: 'app/checkInterval', value: 30 });
        await config.insert({ key: 'app/prerelease', value: false });
        await config.insert({ key: 'app/parallelDownloads', value: false });
        await config.insert({ key: 'app/vibrancy', value: false });
        await config.insert({ key: 'app/developerMode', value: false });
        await config.insert({ key: 'defaults/resolution', value: '1280x720' });
        await config.insert({ key: 'defaults/maxMemory', value: 2048 });
        await config.insert({ key: 'defaults/javaArgs', value: '' });
        await config.insert({ key: 'defaults/patchy', value: false });
        await config.insert({ key: 'rpc/enabled', value: true });
        await config.insert({ key: 'rpc/showProfile', value: true });
        await config.insert({ key: 'rpc/showServer', value: true });
        await config.insert({ key: 'rpc/disableMods', value: true });
        await config.insert({ key: 'notifications/sendNotifications', value: true });
        await config.insert({ key: 'notifications/showTaskbar', value: true });
        await config.insert({ key: 'notifications/sounds', value: [ "native", "legacy", "direct" ] });
    }
});

app.on('quit', () => {
    clearTimeout(saveTask);
    // noinspection JSIgnoredPromiseFromCall
    // this.saveConfig();
});

exports.getValue = async (target) => {
    const entry = await config.findOne({ key: target });
    if (!entry)
        return null;
    return entry.value;


    // let path = target.split('/');
    // let value = this.config;
    // try {
    //     for (let i = 0; i < path.length; i++)
    //         value = value[path[i]];
    //     return value;
    // } catch (e) {
    //     return null;
    // }
};

exports.setValue = async (target, value) => {
    console.log('updating ' + target + ' ' + value);
    const entry = await config.findOne({ key: target });
    console.log(entry)
    entry.value = value;
    await config.update({ key: target }, entry);

    // const oldValue = this.getValue(target);

    // Allows for cancellation
    // let cancelled = false;
    // if (listeners.hasOwnProperty(target)) {
    //     const callbacks = listeners[target];
    //     for (let i = 0; i < callbacks.length; i++) {
    //         const result = callbacks[i](oldValue, value);
    //         if (result)
    //             cancelled = result;
    //     }
    // }
    // if (cancelled)
    //     return;

    // Actually save the new value.
    // console.log(`'${target}' has been changed from '${oldValue}' to '${value}'`);
    // let path = target.split('/');
    // let current = this.config;
    // try {
    //     for (let i = 0; i < path.length; i++) {
    //         if (i === path.length - 1)
    //             current[path[i]] = value;
    //         else current = current[path[i]];
    //     }
    // } catch (e) { }
    // clearTimeout(saveTask);
    // saveTask = setTimeout(this.saveConfig, 60000);
};

exports.saveConfig = async () => {
    // console.log('Saving config...');
    // clearTimeout(saveTask);
    // return fs.writeJson(configFile, this.config, { spaces: 4 });
};

exports.loadConfig = async () => {
    // console.log('Loading config...');
    // const created = await fs.pathExists(configFile);
    // if (!created)
    //     await fs.copy(path.join(__dirname, 'default.json'), configFile);
    // this.config = await fs.readJson(configFile);
    //
    // let maxMem = Math.round(os.totalmem()/1024/1024);
    //
    // while (maxMem % 128 !== 0)
    //     maxMem++;
    //
    // if (!created)
    //     this.setValue('defaults/maxMemory', maxMem / 2);
    //
    // if (this.getValue('app/instanceDir').length === 0)
    //     this.setValue('app/instanceDir', path.join(baseDir, 'Instances'));

};

exports.addEventListener = (target, callback) => {
    if (!listeners.hasOwnProperty(target))
        listeners[target] = [];
    listeners[target].push(callback);
};
