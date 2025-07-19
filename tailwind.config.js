/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors:{
        lightGreen:'#EAF9EE',
        lightRed:'#FBEAEC',
        lightYellow:'#FCF6E5',
        primary:{
          DEFAULT:'#A4081D',
          text:'#161616',
          foreground:"#FFFFFF",
          tint:'#A4081D33',
          google:'#2461B2',
          border:'#D2D8DC',
          dark:'#14171E',
          orange:'#F5871B14',
          grayText:'#555555',
          grayBg:'#F8F8F8',
          green:'#29A44C',
          yellow:'#E9AB00',
          red:'#D2001C'
        },
        grey:{
          1:'#82858B',
          2:'#F2F2F2',
          3:"#3E4147",
          4:'#F7F7F7',
          5:'#D2D8DC',
          6:'#EBEBEB'
        },
        slider:{
         orange:'#D98222',
         dark:'#282018'
        }


        // box-shadow: 0px 4px 16px 0px #69656514;

        // box-shadow: 0px 0px 16px 0px #7C747414;
        
      },

      boxShadow: {
        custom:"2px 2px 8px rgba(0, 0, 0, 0.08), 2px 4px 12px rgba(0, 0, 0, 0.06)",
        custom2: "0px 0px 16px 0px #7C747414", 
      },
    },
  },
  plugins: [],
}

