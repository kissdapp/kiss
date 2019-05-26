function str2ab(str) {
    var buf = new ArrayBuffer(str.length*2); 
    var bufView = new Uint16Array(buf);
    for (var i=0, strLen=str.length; i<strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

  
  export {
    str2ab
  }