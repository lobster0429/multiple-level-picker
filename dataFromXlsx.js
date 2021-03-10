var oFileIn;
$(function() {
  oFileIn = document.getElementById('upload-xlsx');
  if(oFileIn.addEventListener) {
    oFileIn.addEventListener('change', filePicked, false);
  }
});


function filePicked(evt) {
  // Get The File From The Input
  var file = evt.target.files[0];
  var reader = new FileReader();

  reader.onload = function(e) {
    var data = e.target.result;
    var workbook = XLSX.read(data, {
      type: 'binary'
    });

    workbook.SheetNames.forEach(function(sheetName) {
      // Here is your object
      var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
      var json_object = JSON.stringify(XL_row_object);
      //console.log(json_object);
      dataParser(JSON.parse(json_object));
    })

  };

  reader.onerror = function(ex) {
    console.log(ex);
  };
  // Tell JS To Start Reading The File.. You could delay this if desired
  reader.readAsBinaryString(file);
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
      id: idArr.join(''),
      name: o['項目名稱_中文'],
      children: (lv < 3)?[]:null
    }
    

    if (lv == 1) {
      curcate = itm;
      result.push(itm);
    }else{
      if (lv == 2) {
        const aa  = idArr.slice(0, lv).join('');
      }
    }
    
  });

  console.log(result);
  return false;
  const config = {
    id: 'picker',
    width: '90%',
    maxWidth: '350px',
    title: '服務類型選單',
    source: result, 
    limit: 4,
    //acceptLevel: 3,
  }
  const productPicker = new MultipleLevelPicker(config);

  $('[name="display"]').on('click', function () {
    productPicker.show()
  });

  productPicker.on('submit', function (res) {
    console.log(res);
    const names = res.map(r => r.name),
          ids = res.map(r =>  r.id);
    $('[name="display"]').val(names.join(', '));
    $('[name="products"]').val(ids.join(', '));
  });

}


/*
    if (handled[0] !== idArr[0]) {
      handled[0] = idArr[0];
      const itm = {
        id: pre + idArr.join(''),
        name: o['項目名稱_中文'],
        children: null,
      }
      console.log(itm);
      for (let x = 0; x < 1; x++) {
        result.push(itm);
      }
    }
    /*
    idArr.forEach((n, l) => {
      if (handled[l] !== n) {
        handled[l] = n;
        console.log();
      }
      handled.forEach((j, k) => {
        if (n == j) {
          let lv;
          for(let x = 0; x < l; x++) {
            lv = res['children'];
          }
          lv.push({id: idArr.join(), name: j['項目名稱_中文']});
        }else{
          handled[l].push(n);
        }
      });
    });
      */
