
 class FileService {

    constructor() {
        if (FileService.instance) {
            return PuppetService.instance;
        }
        this.fs = require('fs');
        this.jsonPath = 'public/customer.json';
        this.ipPath = `public/ip.txt`;
        FileService.instance = this;
    }

   async writeData(info, ip) {
        try {
            await this.fs.writeFile(this.jsonPath,  JSON.stringify(info), 'utf-8', (err, data) => {
                if (err) {
                    return false;
                }
            });
            this.writeIp(ip);
            return true;
        } catch(e) {
            console.log('file', e);
            return false;
        }
    }

    async writeIp(ip) {
         try {
             await this.fs.writeFile(this.ipPath, ip, 'utf-8', (err, data) => {
                 if(err) {
                     return false;
                 }

                 return true;
         });
             return true;
         } catch(e) {
             console.log('file', e);
             return false;
         }
     }

    readData() {
       return new Promise((resolve, reject) => {
           this.fs.readFile(this.jsonPath, 'utf8' , (err, dat) => {
               if (err) {
                   reject(false);
               }
               resolve(JSON.parse(dat));
     });
       });

    }

     findIp(ip) {
         return new Promise((resolve, reject) => {
         this.fs.readFile(this.ipPath, 'utf8' , (err, data) => {
             if (err) {
                 reject(false);
             }
         resolve(data);
     });
         });

     }
}

export default new FileService();