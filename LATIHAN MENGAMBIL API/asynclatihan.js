const { resolve } = require("path")

function ambilaja(){
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve('udah keambil');
        }, 2000);
    });
}

async function tampilaja() {
    console.log("lagi diambil.....")
    const hasil = await ambilaja();
    console.log(hasil);
    console.log("dah sana pergi.");
}
tampilaja();