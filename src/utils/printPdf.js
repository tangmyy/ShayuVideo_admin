function getStyle() {
  const styleContent = `
    #print-container {
      display: none;
    }
    @media print {
      body > :not(.print-container) {
        display: none;
      }
      html,
      body {
        display: block !important;
      }
      #print-container {
        display: block;
        position: relative;
        width: 100%;
        height: auto;
      }
      .watermark {
        position: fixed;
        top: 60%;
        left: 60%;
        transform: translate(-50%, -50%) rotate(-45deg);
        z-index: 2;
        opacity: 0.7;
        pointer-events: none;
        width: 311px;
        height: 288px;
      }
      .footer-pdf {
        position: fixed;
        bottom: 0px;
        right: 0;
        text-align: center;
        padding: 10px;
        font-size: 12px;
        border-top: 1px solid red;
        z-index: 999 !important;
        width: 100%;
        font-size: 15px;
      }
        @page {
        size: auto;
        margin: 10mm 20mm 20mm 20mm;
        @bottom-left {
          content: "文件编码：123456";
          font-size: 12px;
        }
        @bottom-center {
          content: "单位地址：广州越秀区";
          font-size: 12px;
        }
          @bottom-right {
          content:"服务热线：020-000000 / 第" counter(page) "页"; /* 显示当前页/总页数 */
          font-size: 12px;
        }
        @top-left{
          content:""
        }
      }
  }`;
  const style = document.createElement('style');
  style.innerHTML = styleContent;
  return style;
}

function cleanPrint() {
  const div = document.getElementById('print-container');
  if (div) {
    document.querySelector('body').removeChild(div);
  }
}

function getContainer(html) {
  cleanPrint();

  const container = document.createElement('div');
  container.setAttribute('id', 'print-container');
  container.innerHTML = html;
  return container;
}

function getLoadPromise(dom) {
  let imgs = dom.querySelectorAll('img');
  imgs = [].slice.call(imgs);

  if (imgs.length === 0) {
    return Promise.resolve();
  }

  let finishedCount = 0;
  return new Promise((resolve) => {
    function check() {
      finishedCount += 1;
      if (finishedCount === imgs.length) {
        resolve();
      }
    }
    imgs.forEach((img) => {
      img.addEventListener('load', check);
      img.addEventListener('error', check);
    });
  });
}

function printHtml(html, code = '') {
  return new Promise((resolve) => {
    const style = getStyle(code);
    const container = getContainer(html);
    document.body.appendChild(style);
    document.body.appendChild(container);
    resolve(true);
    getLoadPromise(container).then(() => {
      window.print();
      document.body.removeChild(style);
      document.body.removeChild(container);
    });
  });
}

export default { printHtml };
