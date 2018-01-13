document.title = "Situazione Voti";

$.get("https://web.spaggiari.eu/cvv/app/default/genitori_note.php", function( html_voti ) {

var materie = [];

var rows = $(html_voti).find("#data_table_2 tr");
var materia;
var primoGiro = true;

for (var i = 1; i < rows.length; i++) {
  var r = ($(rows[i]).find("td:first")); //Seleziono una riga (materia)
  if (r.attr("class")) //Materia
  {
      if (!primoGiro)
        materie.push(materia);
      materia = {nome: r.text().trim(), voti: []};
      primoGiro = false;
  } else { //Voto
    if (materia != null)
    {
      var r = $(rows[i]); //Seleziono una riga (voti)
      var voto = ConvertiInVoto(r);
      materia.voti.push(voto);
    }
  }
}

materie.push(materia);
console.log(materie);

var mediaG1 = {media: 0, nMaterie: 0};
var mediaG2 = {media: 0, nMaterie: 0};

var table = document.getElementById("data_table_2");
var items = table.getElementsByTagName('td');

for (var j = 0; j < items.length; j++) {

  if (items[j].className == "registro grautext open_sans_condensed_bold font_size_14") {
    var index = TrovaIndiceMateria(materie, items[j].textContent);
    if (index >= 0) {

      var mediaP1 = MediaVoti(materie[index].voti, "q1");
      var mediaP2 = MediaVoti(materie[index].voti, "q3");

      if (mediaP1 > 0 || mediaP2 > 0)
      {
              mediaG1.media += parseFloat(mediaP1);
              if (mediaP1 > 0)
                  mediaG1.nMaterie++;

              mediaG2.media += parseFloat(mediaP2);
              if (mediaP2 > 0)
                  mediaG2.nMaterie++;

              var html = "<br>";

              if (mediaP1 > 0 && mediaP2 == 0)
              {
                html += "<p class=\"periodo\">P1:</p><p class=\""+ ColoreMedia(mediaP1) +"\">" + mediaP1 + "</p>";
              } else if (mediaP1 > 0 && mediaP2 > 0)
              {
                html += "<p class=\"periodo\">P1:</p><p class=\""+ ColoreMedia(mediaP1) +"\">" + mediaP1 + "</p>" + "<p class=\"periodo\">| P2:</p>" + "<p class=\""+ ColoreMedia(mediaP2) +"\">" + mediaP2 + "</p>";
              }
              items[j].innerHTML = toTitleCase(items[j].textContent.trim()) +  html;
      } else {
        items[j].textContent = toTitleCase(items[j].textContent.trim())
      }
    }
  }
}

if (items.length > 3) {

  console.log(mediaG1, mediaG2);

  if (mediaG1.media > 0 || mediaG2.media > 0)
  {
          var html = "<br><br><div class=\"registro grautext open_sans_condensed_bold font_size_14\">Media Generale:</div>";

          var medG1 = MediaGenerale(mediaG1);
          var medG2 = MediaGenerale(mediaG2);

          if (medG1 > 0 && medG2 == 0)
          {
            html += "<p class=\"periodo\">P1:</p><p class=\""+ ColoreMedia(medG1) +"\">" + medG1 + "</p>";
          } else if (medG1 > 0 && medG2 > 0)
          {
            html += "<p class=\"periodo\">P1:</p><p class=\""+ ColoreMedia(medG1) +"\">" + medG1 + "</p>" + "<p class=\"periodo\">| P2:</p>" + "<p class=\""+ ColoreMedia(medG2) +"\">" + medG2 + "</p>";
          }
          items[1].innerHTML = html;
  }


}
}, "html");
