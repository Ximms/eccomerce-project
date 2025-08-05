

let janji = new Promise((resolve, reject) => {
    let sukses = true;

    if(sukses) {
        resolve("berhasil");
    }else{
        reject("gagal");
    }
});

janji.then((result) => console.log(result))
      .catch((error) => console.log (error));