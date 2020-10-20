import {createReadStream, existsSync, promises as fsPromises, readFileSync} from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import rimraf from 'rimraf';

export interface IReaddir {
  recursive?: boolean;
  folderLevel?: boolean; // for the key and the value will be for the folder
  extension?: string;
  indexOf?: string;
  folders?: string[];
  name?: string; // without extension
}

export default class FileUtils {
  public static async rmDirRecursive(path: string): Promise<void> {
    return new Promise((resolve, reject) => {
      rimraf(path, (error: Error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  public static exist(path: string): boolean {
    return existsSync(path);
  }
  public static resolve(files: string[]): string {
    return path.resolve(process.cwd(), ...files);
  }
  public static async readDir(
    dirPath: string | string[],
    opt: IReaddir,
    paths?: Map<string, string>
  ): Promise<Map<string, string>> {
    if (!paths) paths = new Map<string, string>();
    const fullPath: string =
      typeof dirPath === 'string'
        ? dirPath
        : path.resolve(process.cwd(), ...dirPath);

    const check = file => {
      const isOpt = opt || Object.keys(opt).length;
      const info = path.parse(file.name);
      let name = info.name;
      let url = fullPath;

      if (opt.folderLevel) {
        name = path.parse(fullPath).name;
      } else {
        url = path.resolve(fullPath, file.name);
      }
      if (paths!.has(name)) {
        return;
      }
      if (!isOpt) {
        paths!.set(name, url);
      } else {
        if (opt.name && info.name !== opt.name) {
          return;
        }
        if (opt.folders) {
          const folders = fullPath.split(path.sep);
          let exist = false;
          for (const folder of folders) {
            if (folder && opt.folders.includes(folder)) {
              exist = true;
            }
          }
          if (!exist) return;
        }
        if (opt.extension && info.ext !== '.' + opt.extension) return;

        if (opt.indexOf) {
          const fU = path.resolve(fullPath, file.name);
          if (fU.indexOf(opt.indexOf) < 0) return;
        }
        paths!.set(name, url);
      }
    };

    if (fullPath) {
      const files = await fsPromises.readdir(fullPath as string, {
        withFileTypes: true,
      });

      for (const file of files) {
        if (file.isDirectory()) {
          if (opt?.recursive) {
            await this.readDir(`${fullPath}/${file.name}`, opt, paths);
          }
          if (opt.folderLevel) check(file);
        } else {
          check(file);
        }
      }
    }
    return paths;
  }

  public static async read(filesPath: string | string[]): Promise<string> {
    const list = typeof filesPath === 'string' ? [filesPath] : filesPath;
    const file = path.resolve(process.cwd(), ...list);
    return fsPromises.readFile(file).then(v => v.toString());
  }

  public static readSync(filesPath: string | string[]):string{
    const list = typeof filesPath === 'string' ? [filesPath] : filesPath;
    const file = path.resolve(process.cwd(), ...list);
    return readFileSync(file, 'ascii').toString();
  }

  public static async mkdirRecursive(paths: string[]): Promise<string> {
    const _path = path.resolve(process.cwd(), ...paths);
    return fsPromises.mkdir(_path, { recursive: true }).then(_ => _path);
  }

  public static async readLine(
    file: string,
    callback: (er: Error | null, line: string | null) => void
  ) {
    if (callback) {
      const fileStream = createReadStream(file);
      try {
        const rl = readline.createInterface({
          input: fileStream,
          crlfDelay: Infinity,
        });
        for await (const line of rl) {
          callback(null, line);
        }
      } catch (er) {
        callback(er, null);
      } finally {
        await fileStream.close();
        callback(null, null);
      }
    }
  }

  // To check the equality of lines
  public static cleanString(str?: string): string | undefined {
    if (!str) return str;
    str = str.replace(/[\n\r ]/g, '');
    if (str.length > 2 && str.startsWith("'") && str.endsWith("'")) {
      str = str.substr(1, str.length - 2);
    }
    return str;
  }

  // For save to db
  public static normalizeString(str: string): string {
    if (str) {
      str = str
        // .trim()
        .replace(/[\n|\r]/g, ' ')
        .replace(/\s* /g, ' ');
    }
    return str;
  }

  public static write(path: string, data: string): Promise<void> {
    return fsPromises.writeFile(path, data);
  }

  public static addPrefixToNameFile(file: string, prefix: string): string {
    const parse = path.parse(file);
    const name = prefix + parse.base;
    return path.resolve(parse.dir, name);
  }
}
