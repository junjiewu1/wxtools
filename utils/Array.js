
export function upGo(fieldData,index) {
    if(index!=0){
    
                fieldData[index] = fieldData.splice(index-1, 1, fieldData[index])[0];
    
            }else{
    
                fieldData.push(fieldData.shift());
    
     }
  }
  
export function downGo(fieldData,index) {
 
    if(index!=fieldData.length-1){
 
        fieldData[index] = fieldData.splice(index+1, 1, fieldData[index])[0];
 
    }else{
 
        fieldData.unshift( fieldData.splice(index,1)[0]);
 
    }
 
}

  
  

