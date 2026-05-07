import { Injectable } from '@nestjs/common';
import { CreateUploadImageDto } from './dto/create-upload-image.dto';
import fs = require('fs');

@Injectable()
export class UploadImageService {

  private async uploadMediaFile(
    fileData: Buffer,
    fileFormat = 'png',
    folderPath = 'media/',
    name: string,
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        if (fileData) {
          const fileName = name + `.${fileFormat}`;
          const filePath = `uploads/${folderPath}${fileName}`;
          for (let i = 0; i < 3; i++) {
            let fileNameTemp = name + '.png';
            if (i == 1) {
              fileNameTemp = name + '.jpg';
            } else if (i == 2) {
              fileNameTemp = name + '.jpeg';
            }
            const filePathTemp = `uploads/${folderPath}${fileNameTemp}`;
            if (fs.existsSync(`uploads/${folderPath}`) === false) {
              fs.mkdirSync(`uploads/${folderPath}`, { recursive: true });
            }
            if (fs.existsSync(filePathTemp) === true) {
              fs.unlinkSync(filePathTemp);
            }
            fs.appendFile(filePath, fileData, (err) => {
              if (err) {
                throw err;
              }
              const mediaUrl = `${process.env.SERVER_HOST}/${folderPath}${fileName}`;
              resolve(mediaUrl);
            });
          }
        }
      } catch (e: any) {
        reject(e);
      }
    });
  }

  async uploadImage(params: CreateUploadImageDto, req: any) {
    try {
      const imageUrl = params.imageData;
      const format = params.format;
      const originalData = Buffer.from(imageUrl, 'base64');
      const type = params.type;
      const id = params.id;
      const imageInfo = await this.customImageName(type, id, req.user.id);
      if (!imageInfo) {
        throw new Error('Cant find type');
      }
      const result = await this.uploadMediaFile(
        originalData,
        format,
        `media/${imageInfo.folderPath}`,
        imageInfo.name,
      );
      return { data: result };
    } catch (e: any) {
      const stack = e.stack;
      e = { ...e, stack: stack };
      // logger.error(JSON.stringify(e));
      throw new Error(e.stack.split('\n')[0]);
    }
  }

  async customImageName(type: string, id: number, adminId: number) {
    if (id) {
      switch (type) {
        case 'gioiThieuHeaderUrl':
          return {
            folderPath: `banners/${id}/`,
            name: 'gioiThieuHeaderUrl_new',
          };
        case 'mobileGioiThieuHeaderUrl':
          return {
            folderPath: `banners/${id}/`,
            name: 'mobileGioiThieuHeaderUrl_new',
          };
        case 'gioiThieuFooterUrl':
          return {
            folderPath: `banners/${id}/`,
            name: 'gioiThieuFooterUrl_new',
          };
        case 'mobileGioiThieuFooterUrl':
          return {
            folderPath: `banners/${id}/`,
            name: 'mobileGioiThieuFooterUrl_new',
          };
        case 'user':
          return { folderPath: `${type}s/`, name: `${id}_new` };
        default:
          return;
      }
    } else {
      switch (type) {
        case 'user':
          return { folderPath: `${type}s/`, name: `${adminId}_user` };
        default:
          return;
      }
    }
  }

  async updateImageLink(
    folderPath: string,
    oldFileName: string,
    newFileName: string,
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        const newFile = newFileName.split('.')[0];
        const oldPath = `uploads/${folderPath}${oldFileName}`;
        const newPath = `uploads/${folderPath}${newFileName}`;
        for (let i = 0; i < 3; i++) {
          let fileNameTemp = newFile + '.png';
          if (i == 1) {
            fileNameTemp = newFile + '.jpg';
          } else if (i == 2) {
            fileNameTemp = newFile + '.jpeg';
          }
          if (fs.existsSync(`uploads/${folderPath}${fileNameTemp}`) === true) {
            fs.unlinkSync(`uploads/${folderPath}${fileNameTemp}`);
          }
        }
        fs.renameSync(oldPath, newPath);
        resolve(`${process.env.SERVER_HOST}/${folderPath}${newFileName}`);
      } catch (e: any) {
        reject(false);
      }
    });
  }
}
