import { provideTransloco, TranslocoModule } from '@ngneat/transloco';
import { NgModule } from '@angular/core';
import { TranslocoHttpLoader } from './transloco-loader';

@NgModule({
  imports: [],
  exports: [TranslocoModule],
  providers: [
    provideTransloco({
      config: {
        availableLangs: [
          'de',
          'en',
          'es',
          'fr',
          'id',
          'it',
          'nl',
          'pl',
          'pt',
          'tr',
          'ru',
          'ja',
        ],
        defaultLang: 'en',
        fallbackLang: 'en',
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: true,
      },
      loader: TranslocoHttpLoader,
    }),
  ],
})
export class TranslocoRootModule {}
