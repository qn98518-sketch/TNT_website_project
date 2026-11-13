const fs=require('node:fs');
const sharp=require('sharp');
const sources=require('../tmp/new-media-sources.json');
async function main(){
  fs.mkdirSync('public/images/collection',{recursive:true});
  for(const [name,file] of Object.entries(sources)){
    if(!file)throw new Error('Missing generated image '+name);
    const dest='public/images/collection/'+name+'.webp';
    await sharp(file).resize(1600,1000,{fit:'cover',position:'centre'}).webp({quality:94,effort:4}).toFile(dest);
    const m=await sharp(dest).metadata();
    console.log(name,m.width+'x'+m.height,fs.statSync(dest).size+' bytes');
  }
}
main().catch(e=>{console.error(e);process.exitCode=1});
