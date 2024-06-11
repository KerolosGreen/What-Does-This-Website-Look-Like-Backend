const puppeteer = require('puppeteer');
const Express = require('express');
const cors = require('cors');
const app = Express();
app.use(cors()); 
app.use(Express.json());

app.post('/screenshot/',async(req,res)=>{
    var url = req.body.url;
    const screen_width = req.body.screen_width;
    const screen_height = req.body.screen_height;
    const ismobile = req.body.ismobile;
    const fullpage = req.body.fullpage;
    var image_name = "";
    await Taking_screenshot(screen_width,screen_height,url,ismobile,fullpage).then((data)=>{image_name=data});
    // await res.send('Image Saved With Name : '+image_name);
    res.status(200).contentType("image/jpeg").send(new Buffer(image_name, 'binary'));
})


async function Taking_screenshot(screen_width,screen_height,Link,ismobile,fullpage){
    const browser = await puppeteer.launch({headless: true,args: ['--no-sandbox', '--disable-setuid-sandbox']});
    var timestamp = new Date().getTime();
    const image_name = 'Imgs/scr-'+String(timestamp).substring(8, 12)+'.png';
    const page = await browser.newPage();
    await page.setViewport({ 
        width: parseInt(screen_width), 
        height: parseInt(screen_height),
        deviceScaleFactor: 1,
        isMobile: ismobile,
      });
    await page.goto(Link);
    await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      await page.evaluate(() => {
        window.scrollTo(0, 0);
      });

    await delay(3000);
    // await page.screenshot({path :image_name , fullPage: fullpage});
    const img =await page.screenshot();
    await page.close();
    await browser.close();
    return img;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

app.listen(3001,()=>{
    console.log("Server Works Fine")
})
