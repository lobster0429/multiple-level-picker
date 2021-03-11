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
