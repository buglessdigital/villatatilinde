import { render, screen } from '@testing-library/react';
import MapViewButton from '@/components/MapViewButton';

describe('MapViewButton Component', () => {
    it('renders the button successfully with the correct text', () => {
        render(<MapViewButton />);
        
        // Check for text presence
        const buttonText = screen.getByText(/Harita Görünümü/i);
        expect(buttonText).toBeInTheDocument();
        
        // Ensure its wrapped in a link correctly (next/link renders an anchor tag)
        const linkElement = screen.getByRole('link');
        expect(linkElement).toHaveAttribute('href', '/harita');
    });

    it('renders the map icon', () => {
        render(<MapViewButton />);
        
        // Ensure the img icon is there
        const imgElement = screen.getByRole('presentation', { hidden: true });
        expect(imgElement).toHaveAttribute('src', '/images/map.svg');
    });
});
