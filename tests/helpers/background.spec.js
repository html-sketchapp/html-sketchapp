import {getActualImageSize} from '../../html2asketch/helpers/background';

describe('getActualImageSize', () => {
  test('background-size: contain', () => {
    const bgSize = 'contain';

    const imgSize = {
      width: 400,
      height: 200
    };

    const containerSize = {
      width: 100,
      height: 100
    };

    expect(getActualImageSize(bgSize, imgSize, containerSize)).toEqual({
      width: 100,
      height: 50
    });
  });

  test('background-size: cover', () => {
    const bgSize = 'cover';

    const imgSize = {
      width: 400,
      height: 200
    };

    const containerSize = {
      width: 100,
      height: 100
    };

    expect(getActualImageSize(bgSize, imgSize, containerSize)).toEqual({
      width: 200,
      height: 100
    });
  });

  test('background-size: Xpx', () => {
    const bgSize = '100px';

    const imgSize = {
      width: 400,
      height: 200
    };

    const containerSize = {
      width: 100,
      height: 100
    };

    expect(getActualImageSize(bgSize, imgSize, containerSize)).toEqual({
      width: 100,
      height: 50
    });
  });

  test('background-size: Xpx Xpx', () => {
    const bgSize = '100px 200px';

    const imgSize = {
      width: 400,
      height: 200
    };

    const containerSize = {
      width: 100,
      height: 100
    };

    expect(getActualImageSize(bgSize, imgSize, containerSize)).toEqual({
      width: 100,
      height: 200
    });
  });

  test('background-size: X% X%', () => {
    const bgSize = '50% 25%';

    const imgSize = {
      width: 400,
      height: 200
    };

    const containerSize = {
      width: 100,
      height: 100
    };

    expect(getActualImageSize(bgSize, imgSize, containerSize)).toEqual({
      width: 50,
      height: 25
    });
  });

  test('background-size: X% auto', () => {
    const bgSize = '50% auto';

    const imgSize = {
      width: 400,
      height: 200
    };

    const containerSize = {
      width: 100,
      height: 100
    };

    expect(getActualImageSize(bgSize, imgSize, containerSize)).toEqual({
      width: 50,
      height: 25
    });
  });

  test('background-size: auto Xpx', () => {
    const bgSize = 'auto 100px';

    const imgSize = {
      width: 400,
      height: 200
    };

    const containerSize = {
      width: 100,
      height: 100
    };

    expect(getActualImageSize(bgSize, imgSize, containerSize)).toEqual({
      width: 200,
      height: 100
    });
  });

  test('background-size: auto', () => {
    const bgSize = 'auto';

    const imgSize = {
      width: 400,
      height: 200
    };

    const containerSize = {
      width: 100,
      height: 100
    };

    expect(getActualImageSize(bgSize, imgSize, containerSize)).toEqual({
      width: 400,
      height: 200
    });
  });
});
