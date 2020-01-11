$(document).ready(function(){

    // Recupero l'html del template
    var template_html = $('#giorno-template').html();
    // Compilo l'html con la funzione di handlebars
    var template_function = Handlebars.compile(template_html);

    // Imposto la data di partenza
    var data_iniziale = '2018-01-01';
    var moment_iniziale = moment(data_iniziale);
    var num_giorno_primo_mese = moment_iniziale.isoWeekday();
    var giorni_mese_iniz = moment_iniziale.daysInMonth();


    // Visualizzo il calendario iniziale con Gennaio
    stampa_mese(moment_iniziale);
    stampa_festivita(moment_iniziale);
    var caselle_fine_iniz = 42 - giorni_mese_iniz - num_giorno_primo_mese;
    for (var x = 0; x <= caselle_fine_iniz; x++) {
        $('.grid-container').append('<div data-giorno="data_giorno" class="no-data">vuoto</div>');
    }



    // Intercetto il click sul pulsante mese precedente
   $('#mese_precedente').click(function() {
       // Creo il mese corrente e stampo le festività solo se il mese attuale visualizato è diverso da Gennaio
       $('#mese_successivo').attr("disabled", false);
       if ($('#mese-corrente').text() != 'Gennaio') {
           // Resetto il calendario
           $('.grid-container').empty();
           // Aggiungo un mese alla data da visualizzare
           moment_iniziale.subtract(1, 'months');
           var now = moment_iniziale;
           var num_giorno_inizio_mese = now.clone().isoWeekday();
           var giorni_mese_prec = now.daysInMonth();

           // Aggiungo all'inizio della prima riga tante caselle vuote in base al numero di giorni successivi a partire da lunedì
           for (var j = 0; j < num_giorno_inizio_mese-1; j++) {
               $('.grid-container').prepend('<div data-giorno="data_giorno"></div>');
           }
           // Visualizzo il calendario aggiornato
           stampa_mese(moment_iniziale);
           stampa_festivita(moment_iniziale);
           // Aggiungo alla fine della prima riga tante caselle vuote in base alla sottrazione ottenuta sotrraendo a 35 il numero di caselle vuote aggiunte alla prima riga in modo da riempire tutta la tabella
           var caselle_fine_prec = 42 - giorni_mese_prec - num_giorno_inizio_mese;
           for (var x = 0; x <= caselle_fine_prec; x++) {
               $('.grid-container').append('<div data-giorno="data_giorno" class="no-data">vuoto</div>');
           }
       } else {
           alert('Anno precedente non disponibile');
           // Disattivo il bottone click
           $('#mese_precedente').attr("disabled", true);
       }
   });

    // Intercetto il click sul pulsante mese successivo
    $('#mese_successivo').click(function() {
        // Creo il mese corrente e stampo le festivita solo se il mese attuale visualizzato è diverso da Dicembre
        $('#mese_precedente').attr("disabled", false);
        if ($('#mese-corrente').text() != 'Dicembre') {
            // Resetto il calendario
            $('.grid-container').empty();
            // Aggiungo un mese alla data da visualizzare
            moment_iniziale.add(1, 'months');
            var now = moment_iniziale;
            var num_giorno_inizio_mese = now.clone().isoWeekday();
            var giorni_mese_succ = now.daysInMonth();

            // Aggiungo all'inizio della prima riga tante caselle vuote in base al numero di giorni successivi a partire da lunedì
            for (var j = 0; j < num_giorno_inizio_mese-1; j++) {
                $('.grid-container').prepend('<div data-giorno="data_giorno"></div>');
            }
            // Visualizzo il calendario aggiornato
            stampa_mese(moment_iniziale, num_giorno_inizio_mese);
            stampa_festivita(moment_iniziale);
            // Aggiungo alla fine della prima riga tante caselle vuote in base alla sottrazione ottenuta sotrraendo a 35 il numero di caselle vuote aggiunte alla prima riga in modo da riempire tutta la tabella
            var caselle_fine_succ = 42 - giorni_mese_succ - num_giorno_inizio_mese;
            for (var x = 0; x <= caselle_fine_succ; x++) {
                $('.grid-container').append('<div data-giorno="data_giorno" class="no-data">vuoto</div>');
            }
        }  else {
            alert('Anno successivo non disponibile');
            // Disattivo il bottone click
            $('#mese_successivo').attr("disabled", true);
        }
    });


    function stampa_mese(data_mese, num_giorno_inizio_mese) {
        // Recupero i giorni del mese da visualizzare
        var giorni_mese = data_mese.daysInMonth();
        var mese_testuale = data_mese.format('MMMM');
        mese_testuale = mese_testuale.charAt(0).toUpperCase() + mese_testuale.slice(1);

        // Imposto il titolocon il mese corrente
        $('#mese-corrente').text(mese_testuale);
        // Creoun clone per fare in modo di poterlo usare nel ciclo per ricavare i nomi dei giorni del mese
        var data_giorno = data_mese.clone();
        // Disegno tutti i giorni del mese con un ciclo for
        for (var i = 1; i <= giorni_mese; i++) {
            // costruisco il giorno in formato standard
            var giorno_standard = data_mese.format('YYYY-MM-') + formatta_giorno(i);
            var giorno_testuale = data_giorno.format('ddd');

            var variabili = {
                    day: i + ' ' + giorno_testuale,
                    data_giorno: giorno_standard
            };
            // Creo il template
            var html_finale = template_function(variabili);
            $('.grid-container').append(html_finale);
            data_giorno.add(1, 'days')
        }
    }

    function stampa_festivita(data_mese){
        // Chiamata ajax per avere le festività del mese corrente
        $.ajax({
            'url': 'https://flynn.boolean.careers/exercises/api/holidays',
            'method': 'GET',
            'data': {
                'year': data_mese.year(),
                'month': data_mese.month()
            },
            'success': function(data){
                    var festivita = data.response;
                    for (var i = 0; i < festivita.length; i++) {
                        var festivita_corrente = festivita[i];
                        var data_festa = festivita_corrente.date;
                        var nome_festa = festivita_corrente.name;
                        var giorno_festa_calendario = $('.grid-container div[data-giorno="' + data_festa + '"]')

                        giorno_festa_calendario.addClass('festa').append('<span class="holiday">' + nome_festa + '</span>');
                    }
            },
            'error': function() {
                alert('Nessun cast trovato');
            }
        });
    }

    function formatta_giorno(giorno) {
        if (giorno < 10) {
            return '0' + giorno;
        } else {
            return giorno
        }
    }
});
