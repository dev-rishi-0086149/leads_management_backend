const fs = require("fs").promises;

const getBuffer = async()=>{
    const buffer=await fs.readFile("../public/docs/173487563059488046.pdf");
    const filePath = './example1.bin';
  
    try {
      await fs.writeFile(filePath, buffer);

      console.log('File written successfully!');
    }
    catch(error){

    }
    
}
getBuffer();