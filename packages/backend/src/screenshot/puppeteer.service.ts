/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, OnModuleDestroy } from '@nestjs/common'
import puppeteer from 'puppeteer'

@Injectable()
export class PuppeteerService implements OnModuleDestroy {
  private browser?: puppeteer.Browser

  async getBrowserInstance() {
    if (!this.browser) {
      this.browser = await puppeteer.launch()
    }
    return this.browser
  }

  async getPageInstance(url: string) {
    const browser = await this.getBrowserInstance()
    const page = await browser.newPage()
    await page.goto(url, {
      waitUntil: 'networkidle0'
    })
    return page
  }

  async takeScreenshot(url: string) {
    const page = await this.getPageInstance(url)
    page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1
    })
    const pageScreenshot = await page.screenshot({
      fullPage: true,
      type: 'webp'
    })
    await page.close()
    return pageScreenshot as Buffer // screenshot is a Buffer
  }

  onModuleDestroy() {
    if (this.browser) {
      this.browser.close()
    }
  }
}
