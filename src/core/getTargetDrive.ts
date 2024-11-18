const process = require('child_process');
// cmd命令
const cmdOrder = {
  // drivetype: https://learn.microsoft.com/en-us/dotnet/api/system.io.drivetype?view=net-8.0
  getAllDrive: () => ("wmic logicaldisk where drivetype=2 get deviceid"),
  getOneDriveName: (drive: string) => (`wmic logicaldisk where name="${drive}:" get volumename`)
}

/**
 * 获取电脑中所有可移动盘符及其名称
 * @returns 电脑中所有盘符及其名称
 */
interface D {
    drive: string,
    name: string
}

async function getAllDrives(): Promise<D[]> {
    let result: D[] = [];
    let promise = new Promise((resolve, reject) => {
        // 获取电脑中所有盘符
        process.exec(cmdOrder.getAllDrive(), (error: any, stdout: any) => {
            if (error !== null) {
                console.error(error);
                return;
            }
            //@ts-ignore
            let stdoutArr = [...stdout];
            let res: string[] = [];
            stdoutArr.forEach((v: string, i: number) => {
                if (v === ':') {
                    res.push(stdoutArr[i - 1]);
                }
            })
            let resList: D[] = [];
            let promiseArr: Promise<any>[] = [];
            // 获取所有盘符的所有名称
            res.forEach((v: string) => {
                promiseArr.push(
                    new Promise((resolve, reject) => {
                        process.exec(cmdOrder.getOneDriveName(v), (error: any, stdout: any) => {
                            if (error !== null) {
                                console.error(error);
                                return;
                            }
                            let stdoutArr = [...stdout];
                            let res: string[] = [];
                            stdoutArr.forEach((v: string, i: number) => {
                                if (v !== ' ' && v !== '\n' && v !== '\r') {
                                    res.push(v);
                                }
                            })
                            res.splice(0, 10);
                            resList.push({
                                drive: v,
                                name: res.join('')
                            });
                            resolve(true);
                        })
                    })
                )
            })
            Promise.all(promiseArr).then(res => {
                resolve(resList);
            });
        });
    })
    await promise.then((res: any) => {
        result = res;
    })
    
    return result;
}


export default async function getTargetDrive(targetName: string): Promise<string> {
    let driveList = await getAllDrives()
    for (let d of driveList) {
        if (d.name === targetName) return d.drive
    }
    return ""
}

