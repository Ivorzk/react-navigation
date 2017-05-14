#!/usr/bin/env node

const cwd = process.cwd();
const tmp = require('os').tmpdir();
const join = require('path').join;
const fs = require('fs');
const execSync = require('child_process').execFileSync;
const semver = require('semver');

const boilerplateParentDir = join(tmp, 'react-navigation-native-eject-boilerplate');
const boilerplateURL = "https://github.com/ericvicenti/native-navigation-boilerplate/archive/master.zip";
const boilerplateDir = join(boilerplateParentDir, 'native-navigation-boilerplate-master');
const boilerplateIOSDir = join(boilerplateDir, 'ios');
const boilerplateAndroidDir = join(boilerplateDir, 'android');
const destIOSDir = join(cwd, 'ios');
const destAndroidDir = join(cwd, 'android');
const doesIOSExist = fs.existsSync(destIOSDir);
const doesAndroidExist = fs.existsSync(destAndroidDir);
const appJSON = require(join(cwd, 'app.json'));
const pkgJSON = require(join(cwd, 'package.json'));
const reactVersion = pkgJSON.dependencies['react'];
const reactNativeVersion = pkgJSON.dependencies['react-native'];
const nativeNavVersion = pkgJSON.dependencies['native-navigation'];
const iosPlistFile = join(cwd, 'ios/ReactNativeStarter/Info.plist');
const androidAppManifestDir = join(cwd, 'android/app/src/main/res/values/strings.xml');
const oldDisplayName = 'ReactNativeStarter';

if (reactVersion !== "^15.4.2") {
  console.error('Invalid react version, should be ^15.4.2, and react-native should be ^0.42.0');
  process.exit(0);
}
if (reactNativeVersion !== "^0.42.0") {
  console.error('Invalid react-native version, should be ^0.42.0, and react should be ^15.4.2');
  process.exit(0);
}
if (doesIOSExist && doesAndroidExist) {
  console.error('iOS and Android folder already exist in this project!');
  process.exit(0);
}

console.log('Downloading native boilerplate..');
execSync('mkdir', ['-p', boilerplateParentDir], {});
execSync('curl', ['-L', '-O', boilerplateURL], {cwd: boilerplateParentDir});
execSync('tar', ['-xvzf', 'master.zip'], {cwd: boilerplateParentDir});

if (!nativeNavVersion) {
  console.log('Installing native-navigation');
  execSync('npm', ['i', '--save', 'native-navigation@native-navigation#master'], {cwd: cwd});
}

if (!doesIOSExist) {
  console.log('Creating iOS folder..');
  execSync('cp', ['-r', boilerplateIOSDir, destIOSDir]);

  console.log('Running pod install..');
  execSync('pod', ['install'], {cwd: destIOSDir});

  console.log('Configuring iOS Display Name..');
  const oldPlist = fs.readFileSync(iosPlistFile, {encoding: 'utf8'});
  // TODO: use real parser to handle plists, avoid these shameful hacks:
  const newPlist = oldPlist.split('<key>CFBundleDevelopmentRegion</key>').join(`<key>CFBundleDisplayName</key><string>${appJSON.displayName}</string><key>CFBundleDevelopmentRegion</key>`);
  fs.writeFileSync(iosPlistFile, newPlist);
}

if (!doesAndroidExist) {
  console.log('Creating Android folder..');
  execSync('cp', ['-r', boilerplateAndroidDir, destAndroidDir]);

  console.log('Configuring Android Display Name..');
  const oldManifest = fs.readFileSync(androidAppManifestDir, {encoding: 'utf8'});
  const newManifest = oldManifest.split(oldDisplayName).join(appJSON.displayName);
  fs.writeFileSync(androidAppManifestDir, newManifest);
}
