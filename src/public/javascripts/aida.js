class EventEmitter {
    constructor() {
      this.events = {};
    }

    subscribe(pattern, listener) {
      if (!this.events[pattern]) {
        this.events[pattern] = [];
      }
      this.events[pattern].push(listener);
    }

    emit(eventName, args) {
      Object.keys(this.events).forEach(pattern => {
        if (new RegExp(pattern).test(eventName)) {
          this.events[pattern].forEach(listener => {
            listener(args);
          });
        }
      });
    }
  }

  const EVENTS = {
    UI: {
      ADAPIVE_ELEMENT_BOUNDED: 'ui.element.bounded',
      ACTION_RESPONSE: 'ui.action.response'
    },
    LLM: {
      ADAPT: 'llm.adaptation.request',
      GENERATE_RESPONSE: 'llm.generate.response',
    }
  }

  class Aida {
    constructor() {
      this.ui = new AidaDOMManager(this);

      this.ui.subscribe(EVENTS.UI.ADAPIVE_ELEMENT_BOUNDED, (payload) => {
        console.log('UI response', payload);
      });
    }

    bootstrap() {
      this.ui.bindDOMAdaptiveElements();
    }

    toggleAdaptiveElement(id) {
      //this.ui.setTheme('dark');
    }
  }

  class AidaLLMManager {
    constructor() {
      this.index = {}
    }

    adapt(payload) {
      //let {action, context, text} = args
      axios.post('http://localhost/generate', args)
        .then((response) => {
          //this.emit(EVENTS.LLM.GENERATE_RESPONSE, response.data);
          console.log(response.data);
        }, (error) => {
          //this.emit(EVENTS.LLM.GENERATE_RESPONSE_ERROR, error)
          console.log(error);
        });
    }
  }

  class AidaDOMManager extends EventEmitter {

    constructor() {
      super();
      this.adaptiveElements = {};
    }

    setTheme(theme) {
      //document.documentElement.setAttribute('data-bs-theme', theme);
    }

    adaptElements(){
        let elements = [
          {
            "id": "aida_main_navigation_items_3",
            "style": "p-2 text-primary"
          },
          {
            "id": "aida_main_navigation_items_5",
            "style": "p-2 text-primary"
          },
          {
            "id": "aida_main_navigation_items_8",
            "style": "p-2 text-primary"
          }
        ]

        elements.forEach((element) => {
          let el = document.querySelector(`[data-aida-id="${element.id}"]`);
          el.setAttribute('data-aida-state', 'adapted');
          el.className = element.style;
        });
    }
    //defaultClasses is a workaround for the fact that we didn't create design tokens system guideline and framework for the demo
    registerAdaptiveElement(id, selector, description, defaultClasses) {
      this.adaptiveElements[id] = {
        selector,
        description,
        defaultClasses
      };
    }

    bindDOMAdaptiveElements() {

      Object.keys(this.adaptiveElements).forEach((key) => {
        const value = this.adaptiveElements[key];
        const elements = document.querySelectorAll(value.selector);
        if (elements) {
          let idx = 0
          elements.forEach((element) => {
            let uuid = `aida_${key}_${idx++}`;
            element.uuid = uuid;
            element.className = value.defaultClasses;

            element.setAttribute('data-aida-bounded-adaptive-element', true);
            element.setAttribute('data-aida-state', 'vanilla');
            element.setAttribute('data-aida-id', uuid);

            this.emit(EVENTS.UI.ADAPIVE_ELEMENT_BOUNDED, {
              group: key,
              id: uuid,
              selector: value.selector,
              description: value.description,
              defaultClasses: value.defaultClasses
            })
            //console.log(document.querySelector(`[data-aida-id="aida_${uuid}"]`).innerHTML)
          });

          this.adaptElements();
        }
      });
    }
  }

  const PromptsStrategies = {
    default: `As a UX expert and graphic designer, analyze the provided user profile and UI elements. Utilize the given
    design tokens to issue precise visual instructions for a JavaScript commander.
    The objective is to enhance the UI elements relevant to the persona's profile,
    ensuring they stand out without altering unrelated elements.
    output only coherent styling commands to the element ids that you are provided with, do not add any other styling commands.`,
  }

  //taken from Bootstrap 5.3.2
  const MockDesignTokensByClassesNamesAndDescription = {
    text : `
    .text-primary

    .text-primary-emphasis

    .text-secondary

    .text-secondary-emphasis

    .text-success

    .text-success-emphasis

    .text-danger

    .text-danger-emphasis

    .text-warning

    .text-warning-emphasis

    .text-info

    .text-info-emphasis

    .text-light

    .text-light-emphasis

    .text-dark

    .text-dark-emphasis

    .text-body

    .text-body-emphasis

    .text-body-secondary

    .text-body-tertiary

    .text-black

    .text-white

    .text-black-50

    .text-white-50
    `
  }

  const MockPersonas = {
    A : {
      "name": "AJ",
      "age": 32,
      "occupation": "Software Developer",
      "location": "San Francisco, CA",
      "interests": [
        "Technology",
        "Gadgets",
        "Programming",
        "Science Fiction",
        "Cybersecurity"
      ],
      "profileFeatures": {
        "favoriteWiredSections": ["Tech", "Business", "Science"],
        "preferredReadingDevice": "Tablet",
        "socialMediaUsage": {
          "Twitter": "Daily",
          "Facebook": "Rarely",
          "Instagram": "Weekly"
        },
        "subscriptionStatus": "Active",
        "readingFrequency": "Weekly"
      }
    }
  };

