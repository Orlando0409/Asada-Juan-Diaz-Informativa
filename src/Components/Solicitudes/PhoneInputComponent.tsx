import { useState } from 'react';
import { getCountryCallingCode, getCountries } from 'react-phone-number-input';
import en from 'react-phone-number-input/locale/en';
import 'react-phone-number-input/style.css';

interface PhoneInputComponentProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

const PhoneInputComponent = ({ value, onChange, className = '' }: PhoneInputComponentProps) => {
    // Extraer el código de país del valor actual
    const getCountryFromValue = (phoneValue: string): string => {
        if (!phoneValue || !phoneValue.startsWith('+')) return 'CR';
        
        const countries = getCountries();
        for (const country of countries) {
            const callingCode = getCountryCallingCode(country);
            if (phoneValue.startsWith(`+${callingCode}`)) {
                return country;
            }
        }
        return 'CR';
    };

    const getPhoneNumberWithoutCountryCode = (phoneValue: string, country: string): string => {
        if (!phoneValue || !phoneValue.startsWith('+')) return '';
        try {
            const callingCode = getCountryCallingCode(country as any);
            return phoneValue.replace(`+${callingCode}`, '').trim();
        } catch {
            return '';
        }
    };

    const [selectedCountry, setSelectedCountry] = useState<string>(getCountryFromValue(value));
    const [phoneNumber, setPhoneNumber] = useState<string>(
        getPhoneNumberWithoutCountryCode(value, getCountryFromValue(value))
    );

    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCountry = e.target.value;
        setSelectedCountry(newCountry);
        const callingCode = getCountryCallingCode(newCountry as any);
        const newValue = phoneNumber ? `+${callingCode}${phoneNumber}` : `+${callingCode}`;
        onChange(newValue);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Solo permitir números
        const cleanPhone = e.target.value.replace(/\D/g, '');
        setPhoneNumber(cleanPhone);
        const callingCode = getCountryCallingCode(selectedCountry as any);
        const newValue = cleanPhone ? `+${callingCode}${cleanPhone}` : `+${callingCode}`;
        onChange(newValue);
    };

    const countries = getCountries();

    const callingCode = getCountryCallingCode(selectedCountry as any);

    return (
        <div className={`flex ${className}`}>
            {/* Selector de país con bandera y código (bloqueado) */}
            <div className="relative" style={{ minWidth: '110px', width: '110px' }}>
                <select
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    className="w-full h-full border border-gray-300 rounded-l py-2 focus:outline-none focus:ring focus:ring-blue-300 cursor-pointer bg-white appearance-none border-r-0"
                    style={{
                        paddingLeft: '0.5rem',
                        paddingRight: '1.5rem',
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 0.5rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em',
                        color: 'transparent',
                    }}
                >
                    {countries.map((country) => {
                        const code = getCountryCallingCode(country);
                        const countryName = (en as any)[country] || country;
                        return (
                            <option key={country} value={country} style={{ color: 'black' }}>
                                {countryName} +{code}
                            </option>
                        );
                    })}
                </select>
                {/* Bandera superpuesta */}
                <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1">
                    <img 
                        src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${selectedCountry}.svg`}
                        alt={selectedCountry}
                        className="w-6 h-4"
                    />
                    <span className="text-base">+{callingCode}</span>
                </div>
            </div>

            {/* Input del número de teléfono (solo números) */}
            <input
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="8888 7777"
                className="flex-1 border border-gray-300 rounded-r px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
        </div>
    );
};

export default PhoneInputComponent;
