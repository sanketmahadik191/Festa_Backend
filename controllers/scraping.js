import puppeteer from 'puppeteer';

export const scraping = async(req,res)=>{

   try{ 
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        await page.setViewport({ width: 1920, height: 1080 });
        await page.goto(`https://www.zomato.com/pune/newly-opened`, { timeout: 60000 }); // Navigate with increased timeout
  
        // const clickButton = "#battingTAB > div > a"
        // await page.waitForSelector(clickButton);
        // await page.click(clickButton);

        // <a href="https://www.zomato.com/pune/ora-skybar-kitchen-wakad?zrp_bid=0&amp;zrp_pid=14" title="Ora Skybar &amp; Kitchen" class="sc-jcjGbE sc-dzpdqi CsGqK">Ora Skybar &amp; Kitchen</a>

      } catch (error) {
        console.error('Navigation failed:', error);
      }

      const data = await page.evaluate(()=>{
        const nameElements = document.querySelector("a.sc-jcjGbE.sc-dzpdqi.CsGqK");
        return nameElements;
      })
      console.log(data);
      res.json('suceess');
    }
  catch(error){
    res.json(error)
    console.log(error);
  }
 }