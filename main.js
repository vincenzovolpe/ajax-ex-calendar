$(document).ready(function(){

    // Recupero l'html del template
    var template_html = $('#giorno-template').html();
    // Compilo l'html con la funzione di handlebars
    var template_function = Handlebars.compile(template_html);

    // Imposto la data di partenza
    var data_iniziale = '2018-01-01';
    var moment_iniziale = moment(data_iniziale);

    // Visualizzo il calendario iniziale con Gennaio
    stampa_mese(moment_iniziale);
    stampa_festivita(moment_iniziale);

    // Intercetto il click sul pulsante mese precedente
    $('#mese_precedente').click(function() {
        // Creo il mese corrente e stampo le festività solo se il mese attuale visualizato è diverso da Gennaio
        if ($('#mese-corrente').text() != 'Gennaio') {
            // Aggiungo un mese alla data da visualizzare
            moment_iniziale.subtract(1, 'months');
            console.log(moment_iniziale.format('DD MM YYYY')); // Ogni volta che clicco modifico il moment iniziale
            // Visualizzo il calendario aggiornato
            stampa_mese(moment_iniziale);
            stampa_festivita(moment_iniziale);
        }
    });

    // Intercetto il click sul pulsante mese successivo
    $('#mese_successivo').click(function() {
        // Creo il mese corrente e stampo le festività solo se il mese attuale visualizzato è diverso da Dicembre
        if ($('#mese-corrente').text() != 'Dicembre') {
            // Aggiungo un mese alla data da visualizzare
            moment_iniziale.add(1, 'months');
            console.log(moment_iniziale.format('DD MM YYYY')); // Ogni volta che clicco modifico il moment iniziale
            // Visualizzo il calendario aggiornato
            stampa_mese(moment_iniziale);
            stampa_festivita(moment_iniziale);
        }
    });

    function stampa_mese(data_mese) {
        // Resetto il calendario
        $('#calendario').empty();
        // Recupero i giorni del mese da visualizzare
        var giorni_mese = data_mese.daysInMonth();
        var mese_testuale = data_mese.format('MMMM');
        mese_testuale = mese_testuale.charAt(0).toUpperCase() + mese_testuale.slice(1);

        // Imposto il titolocon il mese corrente
        $('#mese-corrente').text(mese_testuale);

        // Disegno tutti i giorni del mese con un ciclo for
        for (var i = 1; i <= giorni_mese; i++) {
            // costruisco il giorno in formato standard
            var giorno_standard = data_mese.format('YYYY-MM-') + formatta_giorno(i);

            var variabili = {
                    day: i + ' ' + mese_testuale,
                    data_giorno: giorno_standard
            };
            // Creo il template
            var html_finale = template_function(variabili);
            $('#calendario').append(html_finale);
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
                        var giorno_festa_calendario = $('#calendario li[data-giorno="' + data_festa + '"]')

                        giorno_festa_calendario.addClass('festa').append(' - ' + nome_festa);
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
