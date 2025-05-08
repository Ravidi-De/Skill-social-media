const cloud_name = "dsmgswryj";
const uploadPreset = "paf-skill-share";

export const uploadToCloudinary = async (pics,fileType) => {
    if(pics&&fileType){
        const data = new FormData();
        data.append('file', pics);
        data.append('upload_preset', uploadPreset);
        data.append('cloud_name', cloud_name);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/${fileType}/upload`,
            {method: 'POST', body: data}
        )

        console.log(res,"res");

        const fileData = await res.json();
        console.log(fileData.url,"fileData");
        return fileData.url;
        
    }else{
        console.log("error in uploadToCloudinary");
    }
  ;

  
};