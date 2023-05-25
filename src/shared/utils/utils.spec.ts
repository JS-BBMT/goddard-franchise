import { parseFromHtmlString } from '@shared/utils/utils';

describe('parseStringFromTag', () => {
    it('removes <p> tags', () => {
        const result = parseFromHtmlString('<p>test</p>', 'p');
        expect(result).toBe('test');
    });

    it('retrieves innerText from all anchor tags', () => {
        const result = parseFromHtmlString(
            '<p>some text <a>ANCHOR 1</a><a href="https://google.com"> ANCHOR 2</a></p>',
            'a',
            true
        );
        expect(result).toBe('ANCHOR 1 ANCHOR 2');
    });

    it('retrieves inner text from anchor tags with additional attributes', () => {
        const result = parseFromHtmlString(
            '<p>some text <a href="https://google.com" target="_blank" class="some-class">LINK TEXT</a></p>',
            'a'
        );
        expect(result).toBe('LINK TEXT');
    });

    it('retrieves inner text from anchor tag with long href string', () => {
        const result = parseFromHtmlString(
            `<p><a href="https://github.com/Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industries standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of &quot;de Finibus Bonorum et Malorum&quot; (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, &quot;Lorem ipsum dolor sit amet..&quot;, comes from a line in section 1.10.32 Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of &quot;de Finibus Bonorum et Malorum&quot; (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, &quot;Lorem ipsum dolor sit amet..&quot;, comes from a line in section 1.10.32 Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of &quot;de Finibus Bonorum et Malorum&quot; (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, &quot;Lorem ipsum dolor sit amet..&quot;, comes from a line in section 1.10.32Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of &quot;de Finibus Bonorum et Malorum&quot; (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Rree" rel="noopener noreferrer" target="_blank">LINK TEXT</a></p>`,
            'a'
        );
        expect(result).toBe('LINK TEXT');
    });

    it('retrieves outerHTML of all anchor tags', () => {
        const result = parseFromHtmlString(
            '<p>some text <a>ANCHOR 1</a><a> ANCHOR 2</a></p>',
            'a',
            true,
            (e) => e.outerHTML
        );
        expect(result).toBe('<a>ANCHOR 1</a><a> ANCHOR 2</a>');
    });
});
