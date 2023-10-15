import { Pipe, PipeTransform } from '@angular/core';
import clip from "text-clipper";

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: string, limit = 25, completeWords = false, ellipsis = '...') {
    if((value) && (value.length < limit)){
      return value;
    }
    if (completeWords) {
      limit = value?.substr(0, limit).lastIndexOf(' ');
      value= clip(value, limit, { html: true});

    }
    return value?.length > limit ? value?.substr(0, limit) + ellipsis : value;
  }

}
