/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors:{
        // Theme-aware colors that will switch automatically
        background: {
          DEFAULT: '#ffffff', // light mode
          dark: '#000000'     // dark mode
        },
        foreground: {
          DEFAULT: '#000000', // light mode  
          dark: '#ffffff'     // dark mode
        },
        
        // Keep your existing colors but make them theme-aware
        lightGreen:'#EAF9EE',
        lightRed:'#FBEAEC',
        lightYellow:'#FCF6E5',
        
        primary:{
          DEFAULT:'#A4081D',
          text: {
            DEFAULT: '#161616',    // light mode
            dark: '#ffffff'        // dark mode
          },
          foreground:"#FFFFFF",
          tint:'#A4081D33',
          google:'#2461B2',
          border: {
            DEFAULT: '#D2D8DC',    // light mode
            dark: '#404040'        // dark mode
          },
          dark:'#14171E',
          orange:'#F5871B14',
          grayText: {
            DEFAULT: '#555555',    // light mode
            dark: '#A0A0A0'        // dark mode
          },
          grayBg: {
            DEFAULT: '#F8F8F8',    // light mode
            dark: '#1A1A1A'        // dark mode
          },
          green:'#29A44C',
          yellow:'#E9AB00',
          red:'#D2001C'
        },
        
        grey:{
          1: {
            DEFAULT: '#82858B',    // light mode
            dark: '#A0A0A0'        // dark mode
          },
          2: {
            DEFAULT: '#F2F2F2',    // light mode
            dark: '#2A2A2A'        // dark mode
          },
          3: {
            DEFAULT: "#3E4147",    // light mode
            dark: '#5A5A5A'        // dark mode
          },
          4: {
            DEFAULT: '#F7F7F7',    // light mode
            dark: '#1F1F1F'        // dark mode
          },
          5: {
            DEFAULT: '#D2D8DC',    // light mode
            dark: '#404040'        // dark mode
          },
          6: {
            DEFAULT: '#EBEBEB',    // light mode
            dark: '#333333'        // dark mode
          }
        },
        
        slider:{
         orange:'#D98222',
         dark:'#282018'
        },

        // Add semantic color tokens
        card: {
          DEFAULT: '#ffffff',
          dark: '#1A1A1A'
        },
        muted: {
          DEFAULT: '#F8F8F8',
          dark: '#262626'
        },
        border: {
          DEFAULT: '#E5E5E5',
          dark: '#404040'
        }
      },

      boxShadow: {
        custom:"2px 2px 8px rgba(0, 0, 0, 0.08), 2px 4px 12px rgba(0, 0, 0, 0.06)",
        custom2: "0px 0px 16px 0px #7C747414", 
      },
    },
  },
  plugins: [],
}

