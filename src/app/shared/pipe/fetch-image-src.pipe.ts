import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'fetchImageSrc'
})
export class FetchImageSrcPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    let baseURL = environment.baseURL
    return baseURL + value;
  }

}
