import { getVersionTypeChangeFromTitle } from './getVersionTypeChangeFromTitle';

describe(getVersionTypeChangeFromTitle.name, () => {
    const majorCases = ['25.2.7 to 26.0.0', '25.2.7 to 26.0.1', '25.2.7 to 26.1.0', '25.2.7 to 26.1.1']
    const minorCases = ['25.2.7 to 25.3.0', '25.2.7 to 25.3.1', '25.2.7 to 25.4.0', '25.2.7 to 25.4.1']
    const patchCases = ['25.2.7 to 25.2.8', '25.2.7 to 25.2.9']
    const invalidCases = [
        '25.2 to 25.3.0', '25.2.0 to 25.3', '25.2.0 to 25.2.0', '25.2.1 to 25.2.0', '25.2.1 to 25.1.9', 
        '25.2.1 to 25.1.1', '25.2.1 to 25.1.0', '25.2.1 to 24.9.9', '25.2.1 to 24.0.0'
    ];

    it.each(majorCases)('should parse title %s correctly for major version', (version) => {
        const title = `Bump jest from ${version}`;

        const result = getVersionTypeChangeFromTitle(title);

        expect(result).toBe('MAJOR');
    })

    it.each(minorCases)('should parse title %s correctly for minor version', (version) => {
        const title = `Bump jest from ${version}`;

        const result = getVersionTypeChangeFromTitle(title);

        expect(result).toBe('MINOR');
    })

    it.each(patchCases)('should parse title %s correctly for patch version', (version) => {
        const title = `Bump jest from ${version}`;

        const result = getVersionTypeChangeFromTitle(title);

        expect(result).toBe('PATCH');
    })

    it.each(invalidCases)('should throw error for unexpected string %s', (version) => {
        const title = `Bump jest from ${version}`;
        expect(() => getVersionTypeChangeFromTitle(title)).toThrow(expect.any(Error));
    });
})