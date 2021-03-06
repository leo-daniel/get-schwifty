// --------------------------------------------------------------------------
// Variable and Objects
// --------------------------------------------------------------------------

var apiKeyArray = [
  //  "zbAdW4y029x_n7LeeBfkOnaMBT_misas",
  'Uooif7kQrJv4ICrQQUNEuDGNoNfMzbFG',
  '4AW8dHolxjkb_gEXzZJp8TNc_XG3SBDF',
  'xfyIi2-g8XAIdcnL0xcaSSXcGCBYYNZb',
  'NrYhlIHltmdXKjxN_XzW2D2UprgtKGnA'
]
var apiSecretArray = [
  // "qC-vSUpHjGYKs5YseyXbQf1-0Y1qkytl",
  '6ARFRoGr5Rz66_m8KDWwqygfXlBZoMpF',
  'clKHyanKY2E8wf7CgphWTZgAhTJdUbae',
  'apkovzri_CHtDwtjISRHZJX_lhUooHej',
  'QcGMDQPynptvCDh1tmMl5ZTUCYkz6jLv'
]

var score1 = ''
var score2 = ''

// default case is anger
let emotion = 'anger'

// handling for api key
var key = 0

// handling for different players
let ajaxSwitch = false

// player objects
let player1 = {
  url: '',
  wins: 0,
  losses: 0
}
let player2 = {
  url: '',
  wins: 0,
  losses: 0
}

// prevents you from making overlapping ajax calls - see play button onclick event
var submit = true
var go1 = false
var go2 = false

// Sample links for testing
// https://s-i.huffpost.com/gen/2776836/images/o-ANGER-facebook.jpg
// https://flavorwire.files.wordpress.com/2015/09/o-bill-facebook.jpg?w=1920

// --------------------------------------------------------------------------
// Functions
// --------------------------------------------------------------------------
// need to put error handling for ajax calls

function initialAjax (ajaxSwitch) {
  console.log('initial Ajax fired')

  // builds api key and api secret

  // Detect - generate face kye
  let dBaseURL = 'https://api-us.faceplusplus.com/facepp/v3/detect?'
  let dApiKey = 'api_key=' + apiKeyArray[key] + '&'
  let dApiSecret = 'api_secret=' + apiSecretArray[key] + '&'
  let dImageURL = ''
  let dQueryURL = ''

  // handles which image URL to call
  if (!ajaxSwitch) {
    // uses player 1 url
    dImageURL = 'image_url=' + player1.url
    console.log(dImageURL)
  } else {
    // uses player 2 url
    dImageURL = 'image_url=' + player2.url
    console.log(dImageURL)
  }

  dQueryURL = dBaseURL + dApiKey + dApiSecret + dImageURL

  $.ajax({
    url: dQueryURL,
    method: 'POST',
    success: handleToken
  })
}

function handleToken (response) {
  console.log('Handle Token Fired')

  // buids api key and api secret
  let aBaseURL = 'https://api-us.faceplusplus.com/facepp/v3/face/analyze?'
  let aApiKey = 'api_key=' + apiKeyArray[key] + '&'
  let aApiSecret = 'api_secret=' + apiSecretArray[key] + '&'
  let faceId
  let aFaceId = '&face_tokens=' + faceId
  let aQueryURL = aBaseURL + aApiKey + aApiSecret + aFaceId
  let attribute = 'emotion'
  let aAttribute = '&return_attributes=' + attribute

  faceId = response.faces[0].face_token
  aFaceId = '&face_tokens=' + faceId
  aQueryURL = aBaseURL + aApiKey + aApiSecret + aFaceId + aAttribute
  console.log('faceID', faceId)
  console.log('aQuery', aQueryURL)
  $.ajax({
    url: aQueryURL,
    method: 'POST',
    success: faceData
  })
  console.log(aQueryURL)
}

// This is where we handle the emotion object we recieved
function faceData (response) {
  console.log('response', response)

  if (!ajaxSwitch) {
    // save the emotion score obj to player1
    var emotionObj = response.faces[0].attributes.emotion
    player1.emotion = emotionObj
    // changes to player2
    if (ajaxSwitch === false) {
      ajaxSwitch = true

      // calls second ajax with different key;
      key++
      initialAjax(ajaxSwitch)
    }
  } else {
    // save the emotion score obj to player1
    var emotionObj = response.faces[0].attributes.emotion
    player2.emotion = emotionObj
    updateScore()
  }
}

function updateScore () {
  // handling for game result
  var score1 = player1.emotion[emotion]
  var score2 = player2.emotion[emotion]
  reset()

  if (score1 === score2) {
    console.log('tie')
  } else if (score1 > score2) {
    console.log('Player 1 wins')
    $('#winModal1').addClass('is-active')
    player1.wins++
    player2.losses++
    console.log('player1 wins', player1)
    database.ref().once('value', function (snap) {
      database.ref().update({
        player1: {
          anger: player1.emotion.anger,
          digsgust: player1.emotion.disgust,
          fear: player1.emotion.fear,
          happiness: player1.emotion.happiness,
          neutral: player1.emotion.neutral,
          sadness: player1.emotion.sadness,
          surprise: player1.emotion.surprise,
          wins: snap.val().player1.wins + 1,
          losses: snap.val().player1.losses + 0
        },
        player2: {
          anger: player2.emotion.anger,
          digsgust: player2.emotion.disgust,
          fear: player2.emotion.fear,
          happiness: player2.emotion.happiness,
          neutral: player2.emotion.neutral,
          sadness: player2.emotion.sadness,
          surprise: player2.emotion.surprise,
          wins: snap.val().player2.wins + 0,
          losses: snap.val().player2.losses + 1
        }
      })
    })
  } else {
    console.log('Player 2 wins')
    player2.wins++
    player1.losses++
    console.log('player2 wins', player2)
    $('#winModal2').addClass('is-active')
    database.ref().once('value', function (snap) {
      database.ref().update({
        player1: {
          anger: player1.emotion.anger,
          digsgust: player1.emotion.disgust,
          fear: player1.emotion.fear,
          happiness: player1.emotion.happiness,
          neutral: player1.emotion.neutral,
          sadness: player1.emotion.sadness,
          surprise: player1.emotion.surprise,
          wins: snap.val().player1.wins + 0,
          losses: snap.val().player1.losses + 1
        },
        player2: {
          anger: player2.emotion.anger,
          digsgust: player2.emotion.disgust,
          fear: player2.emotion.fear,
          happiness: player2.emotion.happiness,
          neutral: player2.emotion.neutral,
          sadness: player2.emotion.sadness,
          surprise: player2.emotion.surprise,
          wins: snap.val().player2.wins + 1,
          losses: snap.val().player2.losses + 0
        }
      })
    })
  }

  // player 1 emotion scores displayed from firebase
  $('#anger-1').text(player1.emotion.anger)
  $('#disgust-1').text(player1.emotion.disgust)
  $('#fear-1').text(player1.emotion.fear)
  $('#happiness-1').text(player1.emotion.happiness)
  $('#neutral-1').text(player1.emotion.neutral)
  $('#sadness-1').text(player1.emotion.sadness)
  $('#surprise-1').text(player1.emotion.surprise)

  // player 2 emotion scores displayed from firebase
  $('#anger-2').text(player2.emotion.anger)
  $('#disgust-2').text(player2.emotion.disgust)
  $('#fear-2').text(player2.emotion.fear)
  $('#happiness-2').text(player2.emotion.happiness)
  $('#neutral-2').text(player2.emotion.neutral)
  $('#sadness-2').text(player2.emotion.sadness)
  $('#surprise-2').text(player2.emotion.surprise)

  // update scoreboard html from firebase - replaces updateHTML()
  database.ref().on('value', function (snap) {
    const wins1 = $('#wins-1')
    wins1.text(snap.val().player1.wins)
    const wins2 = $('#wins-2')
    wins2.text(snap.val().player2.wins)
    const losses1 = $('#losses-1')
    losses1.text(snap.val().player1.losses)
    const losses2 = $('#losses-2')
    losses2.text(snap.val().player2.losses)
  })
}

function reset () {
  // allows submit button to be hit again and resets ajax switch
  submit = true
  ajaxSwitch = false

  // moves through api key arrayimgSearch = fwl

  key++

  // console.log('key iterator', keimgSearch = fwl)
}

// Changes buttons to ready state after images have been uploaded
function player1Ready () {
  $('#startModal1').text('Player 1 Ready!')
    .removeClass('is-light')
    .addClass('is-success')
}

function player2Ready () {
  $('#startModal2').text('Player 2 Ready!')
    .removeClass('is-light')
    .addClass('is-success')
}
// --------------------------------------------------------------------------
// Pixabay
// --------------------------------------------------------------------------
$(document).on('click', '#pb-submit1', function (e) {
  e.preventDefault
  var imgSearch1 = $('#pb-search1').val().trim()
  var pbQueryBase = 'https://pixabay.com/api/?key=4635969-302d2d8c430786a51835559ca&q='
  var pbQuerySearch1 = pbQueryBase + imgSearch1 + '&category=people&image_type=photo&safesearch=true'

  $.ajax({
    url: pbQuerySearch1,
    method: 'GET',
    success: postImages1
  })

  function postImages1 (response) {
    var arraylen = response.hits.length
    var randomIndex1 = Math.floor(Math.random() * arraylen)
    var randomImage1 = response.hits[randomIndex1].largeImageURL
    $('#image-1').attr('src', randomImage1)
    player1.url = randomImage1
    go1 = true
    player1Ready()
  }
})

$(document).on('click', '#pb-submit2', function (e) {
  e.preventDefault
  var imgSearch2 = $('#pb-search2').val().trim()
  var pbQueryBase = 'https://pixabay.com/api/?key=4635969-302d2d8c430786a51835559ca&q='
  var pbQuerySearch2 = pbQueryBase + imgSearch2 + '&category=people&image_type=photo&safesearch=true'

  $.ajax({
    url: pbQuerySearch2,
    method: 'GET',
    success: postImages2
  })

  function postImages2 (response) {
    var arraylen = response.hits.length
    var randomIndex2 = Math.floor(Math.random() * arraylen)
    var randomImage2 = response.hits[randomIndex2].largeImageURL
    $('#image-2').attr('src', randomImage2)
    player2.url = randomImage2
    go2 = true
    player2Ready()
  }

  // var randomIndex2 = Math.floor(Math.random()*arraylen);
  // var randomImage2 = response.hits[randomIndex2].largeImageURL;
  // $("#image-2").attr('src', randomImage2);
  // player2.url = randomImage2;
  // go2 = true;
  // player2Ready();
})

// var pbQueryURL =

// --------------------------------------------------------------------------
// Main Computation
// --------------------------------------------------------------------------

// Event handlers to input URL into appropriate player obj & start game
$(document)
  .on('click', '#submit-1', function (e) {
    e.preventDefault
    var user1 = $('#user-input-1')
    var userURL = user1.val()
    player1.url = userURL
    go1 = true
    if (userURL !== '') {
      player1Ready()
    }

    // puts images in boxes
    var image1 = $('#image-1')
    image1.attr('src', player1.url)
  })
  .on('click', '#submit-2', function (e) {
    e.preventDefault
    var user2 = $('#user-input-2')
    var userURL = user2.val()
    player2.url = userURL
    go2 = true
    if (userURL !== '') {
      player2Ready()
    }
    // puts images in boxes
    var image1 = $('#image-2')
    image1.attr('src', player2.url)
  })
  .on('click', '#play-button', function (e) {
    // sets emotion from dropdown, default one right now is anger
    emotion = $('#emotion-dropdown :selected').text()

    // goes through apiKeyArray and apiSecretArray
    if (key === apiKeyArray.length) {
      key = 0
    };

    // sets emotion from dropdown, default one right now is anger
    emotion = $('#emotion-dropdown :selected').text()
    var emotionNotSelected = 'Select an emotion...'

    // put ajaxSwitch error handling here
    if (go1 && go2 && submit && emotion != emotionNotSelected) {
      initialAjax(ajaxSwitch)
      new Noty({

        text: 'Processing emotions...',
        theme: 'sunset',

        animation: {
          open: function (promise) {
            var n = this
            var Timeline = new mojs.Timeline()
            var body = new mojs.Html({
              el: n.barDom,
              x: {
                500: 0,
                delay: 0,
                duration: 500,
                easing: 'elastic.out'
              },
              isForce3d: true,
              onComplete: function () {
                promise(function (resolve) {
                  resolve()
                })
              }
            })

            var parent = new mojs.Shape({
              parent: n.barDom,
              width: 200,
              height: n.barDom.getBoundingClientRect().height,
              radius: 0,
              x: {
                150: -150
              },
              duration: 1.2 * 500,
              isShowStart: true
            })

            n.barDom.style['overflow'] = 'visible'
            parent.el.style['overflow'] = 'hidden'

            var burst = new mojs.Burst({
              parent: parent.el,
              count: 10,
              top: n.barDom.getBoundingClientRect().height + 75,
              degree: 90,
              radius: 75,
              angle: {
                [-90]: 40
              },
              children: {
                fill: '#EBD761',
                delay: 'stagger(500, -50)',
                radius: 'rand(8, 25)',
                direction: -1,
                isSwirl: true
              }
            })

            var fadeBurst = new mojs.Burst({
              parent: parent.el,
              count: 2,
              degree: 0,
              angle: 75,
              radius: {
                0: 100
              },
              top: '90%',
              children: {
                fill: '#EBD761',
                pathScale: [0.65, 1],
                radius: 'rand(12, 15)',
                direction: [-1, 1],
                delay: 0.8 * 500,
                isSwirl: true
              }
            })

            Timeline.add(body, burst, fadeBurst, parent)
            Timeline.play()
          },
          close: function (promise) {
            var n = this
            new mojs.Html({
              el: n.barDom,
              x: {
                0: 500,
                delay: 10,
                duration: 500,
                easing: 'cubic.out'
              },
              skewY: {
                0: 10,
                delay: 10,
                duration: 500,
                easing: 'cubic.out'
              },
              isForce3d: true,
              onComplete: function () {
                promise(function (resolve) {
                  resolve()
                })
              }
            }).play()
          }
        }
      }).show()
    } else {
      new Noty({

        text: ' Woah there! Please submit images for players and select an emotion!',
        theme: 'sunset',

        animation: {
          open: function (promise) {
            var n = this
            var Timeline = new mojs.Timeline()
            var body = new mojs.Html({
              el: n.barDom,
              x: {
                500: 0,
                delay: 0,
                duration: 500,
                easing: 'elastic.out'
              },
              isForce3d: true,
              onComplete: function () {
                promise(function (resolve) {
                  resolve()
                })
              }
            })

            var parent = new mojs.Shape({
              parent: n.barDom,
              width: 200,
              height: n.barDom.getBoundingClientRect().height,
              radius: 0,
              x: {
                150: -150
              },
              duration: 1.2 * 500,
              isShowStart: true
            })

            n.barDom.style['overflow'] = 'visible'
            parent.el.style['overflow'] = 'hidden'

            var burst = new mojs.Burst({
              parent: parent.el,
              count: 10,
              top: n.barDom.getBoundingClientRect().height + 75,
              degree: 90,
              radius: 75,
              angle: {
                [-90]: 40
              },
              children: {
                fill: '#EBD761',
                delay: 'stagger(500, -50)',
                radius: 'rand(8, 25)',
                direction: -1,
                isSwirl: true
              }
            })

            var fadeBurst = new mojs.Burst({
              parent: parent.el,
              count: 2,
              degree: 0,
              angle: 75,
              radius: {
                0: 100
              },
              top: '90%',
              children: {
                fill: '#EBD761',
                pathScale: [0.65, 1],
                radius: 'rand(12, 15)',
                direction: [-1, 1],
                delay: 0.8 * 500,
                isSwirl: true
              }
            })

            Timeline.add(body, burst, fadeBurst, parent)
            Timeline.play()
          },
          close: function (promise) {
            var n = this
            new mojs.Html({
              el: n.barDom,
              x: {
                0: 500,
                delay: 10,
                duration: 500,
                easing: 'cubic.out'
              },
              skewY: {
                0: 10,
                delay: 10,
                duration: 500,
                easing: 'cubic.out'
              },
              isForce3d: true,
              onComplete: function () {
                promise(function (resolve) {
                  resolve()
                })
              }
            }).play()
          }
        }
      }).show()
    }
  })

// --------------------------------------------------------------------------
// Modal controls
// --------------------------------------------------------------------------
$('#startModal1').click(function () {
  $('#modal1').addClass('is-active')
})

$('.delete1').click(function () {
  $('#modal1').removeClass('is-active')
})

$('#startModal2').click(function () {
  $('#modal1').removeClass('is-active')
  $('#modal2').addClass('is-active')
})

$('.delete2').click(function () {
  $('#modal2').removeClass('is-active')
})

$('.modal-background').click(function () {
  $('.modal').removeClass('is-active')
})

$('.closeModal').click(function () {
  $('.modal').removeClass('is-active')
})

// --------------------------------------------------------------------------
// ajax error handling
// --------------------------------------------------------------------------

$(document).ajaxError(function () {
  new Noty({

    text: 'Woah Ajax Error!',
    theme: 'sunset',

    animation: {
      open: function (promise) {
        var n = this
        var Timeline = new mojs.Timeline()
        var body = new mojs.Html({
          el: n.barDom,
          x: {
            500: 0,
            delay: 0,
            duration: 500,
            easing: 'elastic.out'
          },
          isForce3d: true,
          onComplete: function () {
            promise(function (resolve) {
              resolve()
            })
          }
        })

        var parent = new mojs.Shape({
          parent: n.barDom,
          width: 200,
          height: n.barDom.getBoundingClientRect().height,
          radius: 0,
          x: {
            150: -150
          },
          duration: 1.2 * 500,
          isShowStart: true
        })

        n.barDom.style.overflow = 'visible'
        parent.el.style.overflow = 'hidden'

        var burst = new mojs.Burst({
          parent: parent.el,
          count: 10,
          top: n.barDom.getBoundingClientRect().height + 75,
          degree: 90,
          radius: 75,
          angle: {
            [-90]: 40
          },
          children: {
            fill: '#EBD761',
            delay: 'stagger(500, -50)',
            radius: 'rand(8, 25)',
            direction: -1,
            isSwirl: true
          }
        })

        var fadeBurst = new mojs.Burst({
          parent: parent.el,
          count: 2,
          degree: 0,
          angle: 75,
          radius: {
            0: 100
          },
          top: '90%',
          children: {
            fill: '#EBD761',
            pathScale: [0.65, 1],
            radius: 'rand(12, 15)',
            direction: [-1, 1],
            delay: 0.8 * 500,
            isSwirl: true
          }
        })

        Timeline.add(body, burst, fadeBurst, parent)
        Timeline.play()
      },
      close: function (promise) {
        var n = this
        new mojs.Html({
          el: n.barDom,
          x: {
            0: 500,
            delay: 10,
            duration: 500,
            easing: 'cubic.out'
          },
          skewY: {
            0: 10,
            delay: 10,
            duration: 500,
            easing: 'cubic.out'
          },
          isForce3d: true,
          onComplete: function () {
            promise(function (resolve) {
              resolve()
            })
          }
        }).play()
      }
    }
  }).show()
})
