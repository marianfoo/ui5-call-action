sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'com/marianzeis/books/test/integration/FirstJourney',
		'com/marianzeis/books/test/integration/pages/BooksList',
		'com/marianzeis/books/test/integration/pages/BooksObjectPage',
		'com/marianzeis/books/test/integration/pages/ChaptersObjectPage'
    ],
    function(JourneyRunner, opaJourney, BooksList, BooksObjectPage, ChaptersObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('com/marianzeis/books') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheBooksList: BooksList,
					onTheBooksObjectPage: BooksObjectPage,
					onTheChaptersObjectPage: ChaptersObjectPage
                }
            },
            opaJourney.run
        );
    }
);