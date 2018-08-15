var toBase64Table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
var base64Pad = '=';
function toBase64(data) {
    var result = '';
    var length = data.length;
    var i;
    // Convert every three bytes to 4 ascii characters.

    for (i = 0; i < (length - 2); i += 3) {
        result += toBase64Table[data.charCodeAt(i) >> 2];
        result += toBase64Table[((data.charCodeAt(i) & 0x03) << 4) + (data.charCodeAt(i + 1) >> 4)];
        result += toBase64Table[((data.charCodeAt(i + 1) & 0x0f) << 2) + (data.charCodeAt(i + 2) >> 6)];
        result += toBase64Table[data.charCodeAt(i + 2) & 0x3f];
    }

    // Convert the remaining 1 or 2 bytes, pad out to 4 characters.

    if (length % 3) {
        i = length - (length % 3);
        result += toBase64Table[data.charCodeAt(i) >> 2];
        if ((length % 3) == 2) {
            result += toBase64Table[((data.charCodeAt(i) & 0x03) << 4) + (data.charCodeAt(i + 1) >> 4)];
            result += toBase64Table[(data.charCodeAt(i + 1) & 0x0f) << 2];
            result += base64Pad;
        } else {
            result += toBase64Table[(data.charCodeAt(i) & 0x03) << 4];
            result += base64Pad + base64Pad;
        }
    }
    return result;
}
/** Convert Base64 data to a string */
var toBinaryTable = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, 0, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1
];
function base64ToString(data) {
    var result = '';
    var leftbits = 0; // number of bits decoded, but yet to be appended
    var leftdata = 0; // bits decoded, but yet to be appended

    // Convert one by one.
    for (var i = 0; i < data.length; i++) {
        var c = toBinaryTable[data.charCodeAt(i) & 0x7f];
        var padding = (data.charCodeAt(i) == base64Pad.charCodeAt(0));
        // Skip illegal characters and whitespace
        if (c == -1) continue;

        // Collect data into leftdata, update bitcount
        leftdata = (leftdata << 6) | c;
        leftbits += 6;

        // If we have 8 or more bits, append 8 bits to the result
        if (leftbits >= 8) {
            leftbits -= 8;
            // Append if not padding.
            if (!padding)
                result += String.fromCharCode((leftdata >> leftbits) & 0xff);
            leftdata &= (1 << leftbits) - 1;
        }

    }



    // If there are any bits left, the base64 string was corrupted

    if (leftbits)
        throw Components.Exception('Corrupted base64 string');
    return result;
}

//toBase64() 将字符串转换为base64
//base64ToString()  将base64 转换为字符串

//七牛云图片上传文件名重名及特殊字符（# .）文件名处理方法
window.sfFileName = function (name) {
    var type = name.replace(/^.+\./,'');
    var file = name.substring(0,name.lastIndexOf("."))
    var myDate = Date.parse(new Date());
    file = file+'-'+myDate;
    file = toBase64(file);
    //file = encodeURI(file);
    return file+'.'+type;
}
//提示层方法
window.sfLayer = {
    elem:document.querySelector("#toast"),
    timer:"",
    makeText:function(info,time){
        this.show();
        this.elem.innerHTML=info;
        this.elem.style.marginLeft=-1*(this.elem.clientWidth/2)+"px";
        this.timer=setTimeout(this.hide.bind(this), time||1000);
    },
    show:function(){
        if(this.elem==null){
            var node=document.createElement("div");
            node.setAttribute("id", "toast");
            node.className="toast";
            document.body.appendChild(node);
            this.elem=document.querySelector("#toast");
        }
        if(this.timer){
            window.clearTimeout(this.timer);
        }
        $.fn.addClass.call($(this.elem),"active");
    },
    hide:function(){
        $.fn.removeClass.call($(this.elem),"active");
    }
}
