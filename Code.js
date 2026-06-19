
const prop = PropertiesService.getScriptProperties();

const containsAny = (input, values) => {

  let value

  string = String(input).toLowerCase().replace("'", '').replace("-", '')
    
  for (x in values) {

    value = values[x].toLowerCase().replace("'", '').replace("-", '')
    
    if (string.includes(value)) {
      return true
    }

  }

}

let label = GmailApp.getUserLabelByName("Phil's Spam Filter") 
  ?? GmailApp.createLabel("Phil's Spam Filter");

function main() {

  var startIdx = parseInt(prop.getProperty('startIndex')) || 0;

  while (true) {

    Logger.log('Starting at startIdx: '+startIdx);
    threads = GmailApp.getInboxThreads(startIdx, 50);
    
    for (i=0; i<threads.length; i++) {
      
      var t = threads[i];
      
      var email = t.getMessages()[0].getFrom();
      var subject = t.getFirstMessageSubject();

      if (email.includes('<')) {
        email = email.split('<')[1].split('>')[0]
      }

      let pos_email = containsAny(email, keywords.positive.email)
      let pos_subject = containsAny(subject, keywords.positive.subject)
      let neg_email = containsAny(email, keywords.negative.email)
      let neg_subject = containsAny(subject, keywords.negative.subject)

      if ((pos_email || pos_subject) && !(neg_email || neg_subject)) {

        Logger.log(subject)

        t.moveToArchive()
        t.addLabel(label)

      }

    }
    
    startIdx += threads.length;
    prop.setProperty('startIndex', startIdx.toString());

  }


  // If complete, reset the start index to 0 for future runs
  prop.setProperty('startIndex', '0');
  Logger.log('Finished processing all inbox threads!');

}
