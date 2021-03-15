const $upload = document.getElementById('upload-xlsx');
$upload.addEventListener('change', function (evt) {
 filePicked(evt)
   .then(res => {
      const data = dataParserV2(res);
      $('#data-output').text(JSON.stringify(data));
   })
   .catch(err => {
     console.log(err);
   })
});

function filePicked(evt) {
  var file = evt.target.files[0];
  var reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = function(e) {
      var data = e.target.result;
      var workbook = XLSX.read(data, {
        type: 'binary'
      });

      workbook.SheetNames.forEach(function(sheetName) {
        // Here is your object
        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        var json_object = JSON.stringify(XL_row_object);
        resolve(JSON.parse(json_object));
      })

    };
    reader.onerror = function(ex) {
     reject(ex);
    };
    reader.readAsBinaryString(file);
  });
}

function dataParser (json) {
  let result = [];
  let proto = {id: '', name: '', children: null};
  const pre = 4;
  const max = 5;
  let curcate;

  json.forEach(o => {
    const idArr = [o['分層2'], o['分層3'], o['分層4'], o['分層5'], o['分層6']];
    let lv = idArr.indexOf('0');
    const itm = {
      id: pre + idArr.join(''),
      name: o['項目名稱_中文'],
      children: (lv < 3)?[]:null
    }
    

    if (lv == 1) {
      curcate = itm;
      result.push(itm);
    }else if (lv == 2) {
      const p = pre + idArr.slice(0, 1).join('');  
      for (let j = 0; j < result.length; j++) {
        const r = result[j];
        if (r.id.slice(0, 2) == p) {
          r.children.push(itm);
          break;
        }
      }
    }else if (lv == 3) {
      const p = pre + idArr.slice(0, 2).join('');  
      const len = p.length;
      result.forEach(r => {
        const c = r.children;
        for(let j = 0; j < c.length; j++) {
          if (c[j].id.slice(0, p.length) == p) {
            c[j].children.push(itm);
            break;
          }
        }
      })    
    }
  });
  return result;
}


function dataParserV2 (json) {
  const pre = 4;
  const bite = [1, 2, 2, 2, 2];
  const len = bite.map((acc ,c) => {return acc + c});
  let result = {};
  let cur;

  json.forEach(o => {
    const idConstructor = [o['分層2'], o['分層3'], o['分層4'], o['分層5'], o['分層6']];
    idConstructor.forEach((d, i) => {
      const diff = bite[i] - d.length;
      let r = d;
      if (diff > 0) {
        for(let i = 0; i < diff; i++) {
          r = '0' + r;
        } 
        idConstructor[i] = r;
      } 
    });

    const pos = (idConstructor.indexOf('00') == -1)?5:idConstructor.indexOf('00');
    const unit = {
      id: pre + idConstructor.join(''),
      name: o['項目名稱_中文'],
    }
    const index = findIndex();
    result[index] = (!result[index])
      ? {level: pos, data: []}
      : result[index];
    result[index].data.push(unit);
    
    function findIndex() {
      let f = ['0', '00', '00', '00', '00'];
      if (pos > 1) {
        for(let w = 0; w < pos-1; w++) {
          f[w] = idConstructor[w]; 
        }
      }
      return pre + f.join('');
    }
  });

  Object.keys(result).forEach(k => {
    const itm = result[k];
    itm.data.forEach(a => {
      a.children = result.hasOwnProperty(a.id);
    });
  });
  console.log(result);
  return result;

}
