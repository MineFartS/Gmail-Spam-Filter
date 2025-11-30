function containsAny(input, values) {

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
if (label == undefined) {
  label = GmailApp.createLabel("Phil's Spam Filter")
}

function loop() {
  
  for (x=0; x<100; x++) {
    main()
  }

}

function main() {

  const threads = GmailApp.getInboxThreads()

  let x, t, email, args, subject

  for (x in threads) {

    t = threads[x]
    
    email = t.getMessages()[0].getFrom()
    subject = t.getFirstMessageSubject()

    if (email.includes('<')) {
      email = email.split('<')[1].split('>')[0]
    }

    args = {

      'pos_email' : containsAny(email, keywords.positive.email),
      'pos_subject' : containsAny(subject, keywords.positive.subject),

      'neg_email' : containsAny(email, keywords.negative.email),
      'neg_subject' : containsAny(subject, keywords.negative.subject)

    }

    if ((args.pos_email || args.pos_subject) && !(args.neg_email || args.neg_subject)) {

      Logger.log(subject)

      t.moveToArchive()

      t.addLabel(label)

    }

  }

}