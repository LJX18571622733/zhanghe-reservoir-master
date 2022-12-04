export const maxMinStep = (listData) => {
    let maxX = Math.max.apply(null, listData);
    let minX = Math.min.apply(null, listData);
    let stepX = (maxX - minX) / 4;
    if (stepX > 0) {
        let s = parseInt(Math.abs(stepX).toString().substring(0, 1));
        let l = parseInt(Math.abs(stepX)).toString().length
        if(s!=5|| s!=0){
            s=(parseInt(s/5)+1)*5
        }
        for (let index = 1; index < l; index++) {
            s = s * 10
        }
        stepX = s;
    } else {
        let is = true;
        let i = 10;
        while (is) {
            i = i * 10;
            if (Math.abs(stepX)*i>1){
                let s = parseInt(stepX*i);
                if(s!=5|| s!=0){
                    s=(parseInt(s/5)+1)*5
                }
                s=s/i;
                stepX = s;
                is=false;
            }
       }
    }
    maxX=(parseInt(maxX/stepX)+1)*stepX;
   /* minX=maxX-stepX*5;*/
    if(minX%stepX==0||minX<0 ){
        minX=(parseInt(minX/stepX)-1)*stepX;
    }else{
        minX=parseInt(minX/stepX)*stepX;
    }
   

    return {max:maxX,min:minX,step:stepX}

}