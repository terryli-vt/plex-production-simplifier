const net = require("net");
const client = new net.Socket();
client.connect(9100, "10.24.1.50", function () {
  client.write(
    "^XA^EG^XZ~DGR:Img5745,^XA^MCY^CI28^CF0^XZ^XA^FO12,108^A0N,32,32^FDSR3466553^FS^FO12,148^A0N,16,32^FB256,1,,L^FDPart Description:^FS^FO12,28^A0N,16,32^FB176,1,,L^FDPart Number:^FS^FO12,168^A0N,24,16^FB560,1,,L^FDBLK R1S FABRIC ADVE SUBSTRATE with speaker^FS^FO12,48^A0N,32,32^FD5200033^FS^BY3.00,,0^FO288,32^BQ,2,4,,7^FH_^FD_0A_0D                   520003322304A0001SR3466553^FS^FO12,88^A0N,16,32^FB120,1,,L^FDSerial:^FS^FO80,0^XGImg5745,1.00,1.00^FS^FO224,208^A0N,24,24^FD10-30^FS^FO336,208^A0N,24,24^FD16:44^FS^BY1,3,40^FO8000,204^B3N,N,,N,N^FDSR3466553^FS^BY1,3,40^FO12,204^BCN,,N,N,N,N^FDSR3466553^FS^PQ1^LRN^XZ^XA^MCY^PON^LH0,0^XZ"
  ); // Example ZPL code
});
