function ConvertiInVoto(row)
{
  var r = row.find("td:eq(1)");
  var classP = $(r).attr("class").split(" ");
  var periodoV = classP[classP.length - 1];
  var bluV = $(r).find("div:first").attr("class").indexOf("f_reg_voto_dettaglio") > 0;
  var dati = $(r).find("p");
  var data_ambito = $(dati[0]).text().split(" - ");
  var ambitoV = data_ambito[0];
  var dataV = data_ambito[1];
  var votoN = $(dati[1]).text();

  var VotoDecimale = ConvertiInVotoNumerico(votoN);

  var r = row.find("td:eq(3)");
  var dettagliov = r.text().trim();

  var voto = {voto: VotoDecimale, blu: bluV, data:dataV, ambito: ambitoV, dettaglio: dettagliov, periodo: periodoV };
  return voto;
}



function ConvertiInVotoNumerico(voto) {
  var VotoEff = -1;
  try {
      var tmp;
      if (voto.length == 2) {
          if (voto.indexOf("+") > 0) {
              tmp = voto.replace("+", ".25").trim();
              if (VotoValido(tmp)) {
                  VotoEff = parseFloat(tmp);
              }
          } else if (voto.indexOf("-") > 0) {
              tmp = voto.replace("-", "").trim();
              if (VotoValido(tmp)) {
                  VotoEff = parseFloat(tmp) - 0.25;
              }
          } else if (voto.indexOf("½") > 0) {
              tmp = voto.replace("½", ".5");
              if (VotoValido(tmp)) {
                  VotoEff = parseFloat(tmp);
              }
          } else if (VotoValido(voto)) {
              VotoEff = parseFloat(voto);
          }
      } else if (voto.length == 1 && VotoValido(voto)) {
          VotoEff = parseFloat(voto);
      } else if (voto.length == 3) {
          if (voto.indexOf("-") > 0) {
              tmp = voto.replace("-", "");
              if (VotoValido(tmp)) {
                  VotoEff = parseFloat(tmp) - 0.25;
              }
          } else if (voto.indexOf("/") > 0) {
              tmp = voto.substring(voto.indexOf("/") + 1);
              if (VotoValido(tmp)) {
                  VotoEff = parseFloat(tmp) - 0.25;
              }
          }
      } else if (voto.length == 4) {
          if (VotoValido(voto)) {
              VotoEff = parseFloat(voto);
          }
      } else if (voto.length == 5 && voto.indexOf("1/2") > 0) {
          tmp = voto.replace(" 1/2", ".5");
          if (VotoValido(tmp)) {
              VotoEff = parseFloat(tmp);
          }
      }
      return VotoEff;
  } catch (error) {
      console.log(error);
      return -1;
  }
}


function VotoValido(voto) {
    try {
        var v = parseFloat(voto.trim());
        return true;
    } catch (err) {
        return false;
    }
}


function TrovaIndiceMateria(materie, nome)
{
  for (var i = 0; i < materie.length; i++) {

    var m1 = materie[i].nome.replace("...","").trim();
    var m2 = nome.replace("...","").trim();
    if (m2.indexOf(m1) >= 0)
    return i;
  }

  return -1;
}


function MediaVoti(voti)
{
  var nVoti = voti.length;
  var media = 0;
  for (var i = 0; i < voti.length; i++) {
    if (!voti[i].blu) {
      media += voti[i].voto;
    } else {
      nVoti--;
    }
  }
  return (media / nVoti).toFixed(2);
}

function MediaVoti(voti, periodo)
{
  var nVoti = voti.length;
  var media = 0;
  for (var i = 0; i < voti.length; i++) {
    if (!voti[i].blu && voti[i].periodo == periodo) {
      media += voti[i].voto;
    } else {
      nVoti--;
    }
  }
  if (nVoti > 0)
    return (media / nVoti).toFixed(2);
  else return 0;
}

function MediaGenerale(generale)
{
  if (generale.nMaterie > 0)
    return (generale.media / generale.nMaterie).toFixed(2);
  else return 0;
}


function ColoreMedia(media)
{
  if (media < 5.5)
    return "media_rosso";
  else if (media >= 5.5 && media < 6)
    return "media_arancione";
    else if (media >= 6 && media <=10)
    return "media_verde";
    else return "media_blu";
}

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
