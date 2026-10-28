import test from 'node:test';
import assert from 'node:assert/strict';
import { getSystemDetails, resolveVideoPlayerSource } from './systemDetails';
import { INITIAL_SYSTEMS } from '../data/initialSystems';

test('getSystemDetails returns rich whatItDoes, advantages, offeredCategories, demoVideos and videoUrl for every initial system', () => {
  for (const sys of INITIAL_SYSTEMS) {
    const details = getSystemDetails(sys);
    assert.ok(details.overview.length > 20, `Overview missing for ${sys.id}`);
    assert.ok(details.whatItDoes.length >= 3, `whatItDoes should have at least 3 items for ${sys.id}`);
    assert.ok(details.advantages.length >= 3, `advantages should have at least 3 items for ${sys.id}`);
    assert.ok(details.offeredCategories.length >= 4, `offeredCategories should have at least 4 items for ${sys.id}`);
    assert.ok(details.demoVideos.length >= 2, `demoVideos should have at least 2 videos for ${sys.id}`);
    assert.ok(details.demoVideos[0].title.length > 5);
    assert.ok(sys.videoUrl && sys.videoUrl.length > 10, `videoUrl missing on initial system ${sys.id}`);
    assert.equal(details.videoUrl, sys.videoUrl);
    assert.equal(details.demoVideos[0].videoUrl, sys.videoUrl);
    assert.ok(Array.isArray(sys.faqs) && sys.faqs.length >= 3, `faqs missing on initial system ${sys.id}`);
    assert.equal(details.faqs.length, sys.faqs.length);
    assert.ok(details.faqs[0].question.length > 10);
    assert.ok(details.faqs[0].answer.length > 15);
  }
});

test('resolveVideoPlayerSource detects YouTube links and native video URLs', () => {
  const ytWatch = resolveVideoPlayerSource('https://www.youtube.com/watch?v=M7lc1UVf-VE');
  assert.equal(ytWatch.type, 'youtube');
  assert.equal(ytWatch.src, 'https://www.youtube.com/embed/M7lc1UVf-VE?rel=0');

  const ytShortLink = resolveVideoPlayerSource('https://youtu.be/M7lc1UVf-VE');
  assert.equal(ytShortLink.type, 'youtube');
  assert.equal(ytShortLink.src, 'https://www.youtube.com/embed/M7lc1UVf-VE?rel=0');

  const ytEmbed = resolveVideoPlayerSource('https://www.youtube.com/embed/M7lc1UVf-VE');
  assert.equal(ytEmbed.type, 'youtube');
  assert.ok(ytEmbed.src.includes('youtube.com/embed/M7lc1UVf-VE'));

  const mp4Video = resolveVideoPlayerSource('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
  assert.equal(mp4Video.type, 'video');
  assert.equal(mp4Video.src, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');

  const emptyVideo = resolveVideoPlayerSource('   ');
  assert.equal(emptyVideo.type, 'none');
  assert.equal(emptyVideo.src, '');
});

test('getSystemDetails respects custom Admin overrides on a SystemProduct including videoUrl and faqs', () => {
  const base = INITIAL_SYSTEMS[0];
  const customSys = {
    ...base,
    videoUrl: 'https://youtu.be/dQw4w9WgXcQ',
    whatItDoes: ['Ação personalizada 1', 'Ação personalizada 2'],
    advantages: [{ title: 'Vantagem Exclusiva', description: 'Descrição exclusiva', metric: '+99%' }],
    offeredCategories: [{ name: 'Módulo Especial', description: 'Subcategoria especial', badge: 'VIP' }],
    faqs: [
      {
        question: 'Pergunta exclusiva configurada no sistema?',
        answer: 'Resposta exclusiva detalhada para o cliente.',
        category: 'FAQ Custom',
      },
    ],
    demoVideos: [
      {
        id: 'custom-v1',
        title: 'Vídeo Customizado Admin',
        duration: '01:45',
        category: 'Demo',
        description: 'Vídeo configurado pelo admin',
      },
    ],
  };

  const details = getSystemDetails(customSys);
  assert.equal(details.videoUrl, 'https://youtu.be/dQw4w9WgXcQ');
  assert.equal(details.demoVideos[0].videoUrl, 'https://youtu.be/dQw4w9WgXcQ');
  assert.deepEqual(details.whatItDoes, ['Ação personalizada 1', 'Ação personalizada 2']);
  assert.equal(details.advantages[0].title, 'Vantagem Exclusiva');
  assert.equal(details.offeredCategories[0].name, 'Módulo Especial');
  assert.equal(details.demoVideos[0].title, 'Vídeo Customizado Admin');
  assert.equal(details.faqs.length, 1);
  assert.equal(details.faqs[0].question, 'Pergunta exclusiva configurada no sistema?');
});

