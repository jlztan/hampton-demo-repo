<template>
  <div>
    <div class="oper-bar">
      <div class="upload-file">
        <input type="file" ref="fielinput" @change="uploadFile" />
      </div>
      <div class="oper-bt">
        <button @click="prevPage">上一页</button>
        <button @click="nextPage">下一页</button>
      </div>
      <div class="render-url">
        <input
          type="text"
          placeholder="输入 pdf 的 url"
          id="urlInputBox"
          value="https://s3.cn-northwest-1.amazonaws.com.cn/s3-pro-nx-staticphoto/staticpic/shouce/Modbus%20User%20Manual.pdf"
        />
        <button @click="renderUrlPdf">url pdf</button>
        <span class="tip" title="由于存在跨域问题，输入的 url 只用来测试，手动输入 url 并不起作用！">i</span>
      </div>
    </div>

    <div class="canvas-container">
      <canvas ref="myCanvas" class="pdf-container"> </canvas>
    </div>
  </div>
</template>

<script>
import pdfJS from 'pdfjs-dist';
export default {
  mounted() {},
  data() {
    return {
      pdfData: '', // PDF 的 base64 编码
      pdfDoc: '', // 加载之后的 pdf 文件
      scale: 2, // 缩放值
      pageNumber: 1, //当前页码
      pages: 0, //总页数
    };
  },
  methods: {
    // 从 url 加载 pdf 文件
    renderUrlPdf() {
      // let inputUrl = document.getElementById('urlInputBox').value;
      // let reg =
      //   '^((https|http|ftp|rtsp|mms)://)?[a-z0-9A-Z]{3}\.[a-z0-9A-Z][a-z0-9A-Z]{0,61}?[a-z0-9A-Z]\.com|net|cn|cc (:s[0-9]{1-4})?/$';
      // if (!new RegExp(reg).test(inputUrl)) {
      //   alert('url 格式不正确，请重新输入！');
      //   return;
      // }
      let params =
        '/modbus/s3-pro-nx-staticphoto/staticpic/shouce/Modbus%20User%20Manual.pdf';
      this.loadPDF(params);
    },
    // 在页面上传 pdf 文件
    uploadFile() {
      let inputDom = this.$refs.fielinput;
      let file = inputDom.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.pdfData = atob(
          reader.result.substring(reader.result.indexOf(',') + 1)
        );
        let params = {
          data: this.pdfData, // PDF base64编码
          // cMapUrl: CMAP_URL,
          cMapPacked: true,
        };
        this.loadPDF(params);
      };
    },
    // 上一页
    prevPage() {
      if (this.pageNumber <= 1) {
        alert('已经是第一页！');
        return;
      }
      this.getPage(--this.pageNumber);
    },
    // 下一页
    nextPage() {
      if (this.pageNumber >= this.pdfDoc.numPages) {
        alert('到达最后一页！');
        return;
      }
      this.getPage(++this.pageNumber);
    },
    // 加载 pdf
    loadPDF(params) {
      let _this = this;
      // 引入pdf.js的字体
      // let CMAP_URL = 'https://unpkg.com/pdfjs-dist@2.0.943/cmaps/';
      //读取base64的pdf流文件
      pdfJS.getDocument(params).promise.then((pdf) => {
        _this.pdfDoc = pdf;
        if (pdf.numPages <= 0) {
          alert('PDF 页数小于 1！');
          return;
        }
        // this.loadFinished = true;
        _this.getPage(1);
      });
    },
    // 将单页 pdf 渲染到页面
    getPage(pageNumber) {
      this.pdfDoc.getPage(pageNumber).then((page) => {
        // 获取DOM中为预览PDF准备好的canvasDOM对象
        let canvas = this.$refs.myCanvas;
        let viewport = page.getViewport(this.scale);
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        let ctx = canvas.getContext('2d');
        let renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };
        page.render(renderContext);
      });
    },
  },
};
</script>

<style scoped>
.canvas-container {
  border: 1px dashed black;
  position: relative;
}

.canvas-container .pdf-container {
  width: 750px;
}

.oper-bar {
  display: flex;
  height: 30px;
  width: 100%;
  align-items: center;
}
.oper-bar .upload-file {
  display: flex;
  flex-basis: 40%;
  justify-content: flex-end;
}

.oper-bar .upload-file input {
  outline: auto;
}

.oper-bar .render-url {
  display: flex;
  flex-basis: 40%;
  align-items: center;
}

.oper-bar .render-url .tip {
  width: 18px;
  height: 18px;
  cursor: default;
  margin-left: 5px;
  border-radius: 50%;
  background-color: yellow;
}

.oper-bar .oper-bt {
  display: flex;
  margin: 0 auto;
  background-color: red;
}
</style>
