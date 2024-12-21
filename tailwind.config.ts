import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
	darkMode: ["class"],
	content: ["./src/**/*.tsx"],
	theme: {
		extend: {
			fontFamily: {
				sans: [
					'var(--font-geist-sans)',
					...fontFamily.sans
				]
			},
			colors: {
				primary: 'hsl(219, 15%, 18%)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'bounce-arrow': {
					'0%, 100%': {
						transform: 'translateY(-25%)',
						animationTimingFunction: 'cubic-bezier(0,0,0.2,1)',
					},
					'50%': {
						transform: 'translateY(25%)',
						animationTimingFunction: 'cubic-bezier(0.8,0,1,1)',
					}
				}
			},
			animation: {
				'bounce-arrow': 'bounce-arrow 1s infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
