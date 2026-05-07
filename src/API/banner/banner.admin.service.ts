import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateBannerDto } from './dto';
import { Banner } from 'src/database/entities';
import { UploadImageService } from '../upload-image/upload-image.service';
import CheckPermission from '../../common/module/checkPermission';

@Injectable()
export class AdminBannerService {
  constructor(
    @InjectRepository(Banner)
    private bannerRepo: Repository<Banner>,
    private checkPermission: CheckPermission,
    private uploadService: UploadImageService,
  ) { }
  async adminUpdate(id: number, params: UpdateBannerDto, req: any) {
    try {
      // Kiểm tra quyền cập nhật banner
      await this.checkPermission.Check(req.user, 'update');
      // Kiểm tra id banner có tồn tại
      const idCheck = await this.bannerRepo.findOne({
        where: { competitionId: id },
      });
      if (!idCheck) {
        throw new NotFoundException('CANT_FIND_BANNER');
      }
      const paramsCopy = { ...params };
      delete paramsCopy.redirectGioiThieuHeaderUrl;
      delete paramsCopy.contentGioiThieuHeader;
      delete paramsCopy.redirectGioiThieuFooterUrl;
      delete paramsCopy.contentGioiThieuFooter;
      delete paramsCopy.redirectTheLeHeaderUrl;
      delete paramsCopy.contentTheLeHeader;
      delete paramsCopy.redirectTheLeFooterUrl;
      delete paramsCopy.contentTheLeFooter;
      delete paramsCopy.redirectFaqHeaderUrl;
      delete paramsCopy.contentFaqHeader;
      delete paramsCopy.redirectFaqFooterUrl;
      delete paramsCopy.contentFaqFooter;
      delete paramsCopy.redirectNewsHeaderUrl;
      delete paramsCopy.contentNewsHeader;
      delete paramsCopy.redirectNewsFooterUrl;
      delete paramsCopy.contentNewsFooter;
      delete paramsCopy.redirectRankHeaderUrl;
      delete paramsCopy.contentRankHeader;
      delete paramsCopy.redirectRankFooterUrl;
      delete paramsCopy.contentRankFooter;
      delete paramsCopy.redirectWorkshopHeaderUrl;
      delete paramsCopy.contentWorkshopHeader;
      delete paramsCopy.redirectWorkshopFooterUrl;
      delete paramsCopy.contentWorkshopFooter;
      delete paramsCopy.redirectDauAnCuocThiHeaderUrl;
      delete paramsCopy.contentDauAnCuocThiHeader;
      delete paramsCopy.redirectDauAnCuocThiFooterUrl;
      delete paramsCopy.contentDauAnCuocThiFooter;
      for (const key in paramsCopy) {
        if (paramsCopy[key] !== idCheck[key]) {
          const imgUrl = paramsCopy[key];
          // Update image link
          const fileFormat = imgUrl.split('.').reverse()[0];
          const oldFileName = imgUrl.split('/').reverse()[0];
          const newFileName = `${key}.${fileFormat}`;
          const folderPath = `media/banners/${id}/`;
          const newImageLink = await this.uploadService.updateImageLink(
            folderPath,
            oldFileName,
            newFileName,
          );
          params[key] = newImageLink.toString();
        }
      }
      // Cập nhật banner
      const result = await this.bannerRepo.update(idCheck.id, params);
      // Trả về kết quả
      return result;
    } catch (e: any) {
      const stack = e.stack;
      e = { ...e, stack: stack };
      if (e.message == 'CANT_FIND_BANNER') {
        throw new NotFoundException('CANT_FIND_BANNER');
      } else {
        throw new Error(e.stack.split('\n')[0]);
      }
    }
  }

  async createBanner(id: number) {
    try {
      const params = {
        competitionId: id,
        gioiThieuHeaderUrl: '',
        mobileGioiThieuHeaderUrl: '',
        redirectGioiThieuHeaderUrl: '',
        contentGioiThieuHeader: '',
        gioiThieuFooterUrl: '',
        mobileGioiThieuFooterUrl: '',
        redirectGioiThieuFooterUrl: '',
        contentGioiThieuFooter: '',
        theLeHeaderUrl: '',
        mobileTheLeHeaderUrl: '',
        redirectTheLeHeaderUrl: '',
        contentTheLeHeader: '',
        theLeFooterUrl: '',
        mobileTheLeFooterUrl: '',
        redirectTheLeFooterUrl: '',
        contentTheLeFooter: '',
        faqHeaderUrl: '',
        mobileFaqHeaderUrl: '',
        redirectFaqHeaderUrl: '',
        contentFaqHeader: '',
        faqFooterUrl: '',
        mobileFaqFooterUrl: '',
        redirectFaqFooterUrl: '',
        contentFaqFooter: '',
        newsHeaderUrl: '',
        mobileNewsHeaderUrl: '',
        redirectNewsHeaderUrl: '',
        contentNewsHeader: '',
        newsFooterUrl: '',
        mobileNewsFooterUrl: '',
        redirectNewsFooterUrl: '',
        contentNewsFooter: '',
        rankHeaderUrl: '',
        mobileRankHeaderUrl: '',
        redirectRankHeaderUrl: '',
        contentRankHeader: '',
        rankFooterUrl: '',
        mobileRankFooterUrl: '',
        redirectRankFooterUrl: '',
        contentRankFooter: '',
        workshopHeaderUrl: '',
        mobileWorkshopHeaderUrl: '',
        redirectWorkshopHeaderUrl: '',
        contentWorkshopHeader: '',
        workshopFooterUrl: '',
        mobileWorkshopFooterUrl: '',
        redirectWorkshopFooterUrl: '',
        contentWorkshopFooter: '',
        dauAnCuocThiHeaderUrl: '',
        mobileDauAnCuocThiHeaderUrl: '',
        redirectDauAnCuocThiHeaderUrl: '',
        contentDauAnCuocThiHeader: '',
        dauAnCuocThiFooterUrl: '',
        mobileDauAnCuocThiFooterUrl: '',
        redirectDauAnCuocThiFooterUrl: '',
        contentDauAnCuocThiFooter: '',
      };
      const result = await this.bannerRepo.insert(params);
      return result;
    } catch (e: any) {
      const stack = e.stack;
      e = { ...e, stack: stack };
      throw new Error(e.stack.split('\n')[0]);
    }
  }
}
