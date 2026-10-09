import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { HomeComponent } from './home.component';
import { SeoService } from '../../core/seo.service';
import { ToolService } from '../../core/tool.service';

class TestHome extends HomeComponent {
  tools() { return this.visibleTools(); }
  search(query: string) {
    this.onSearch({ target: { value: query } } as unknown as Event);
    return this.visibleTools();
  }
  chooseCategory(id: string) {
    this.selectCategory(id);
    return this.visibleTools();
  }
  clear() {
    this.clearSearch();
    return this.visibleTools();
  }
  channelList() { return this.channels(); }
  selectedChannel() { return this.activeChannel(); }
  quickStart() { return this.quickTools; }
  dial() { return this.dialTransform(); }
}

describe('homepage utility engine', () => {
  function create() {
    TestBed.configureTestingModule({
      providers: [{ provide: SeoService, useValue: { apply: vi.fn() } }],
    });
    return TestBed.runInInjectionContext(() => new TestHome());
  }

  it('exposes all nine category channels and the complete inventory', () => {
    const home = create();
    const tools = TestBed.inject(ToolService);
    expect(home.channelList()).toHaveLength(9);
    expect(home.channelList().map((channel) => channel.id)).toContain('image');
    expect(home.tools()).toHaveLength(tools.byCategory('developer').length);
  });

  it('switches categories and searches the full inventory', () => {
    const home = create();
    expect(home.chooseCategory('image').some((tool) => tool.id === 'qr-code-generator')).toBe(true);
    expect(home.chooseCategory('css').every((tool) => tool.category === 'css')).toBe(true);
    expect(home.search('json').some((tool) => tool.id === 'json-formatter')).toBe(true);
    expect(home.search('zzzz-no-tool')).toHaveLength(0);
    expect(home.clear()).toHaveLength(TestBed.inject(ToolService).byCategory('css').length);
  });

  it('keeps quick-start links registered', () => {
    const home = create();
    const tools = TestBed.inject(ToolService);
    expect(home.quickStart()).toHaveLength(4);
    expect(home.quickStart().every((tool) => tools.get(tool.id))).toBe(true);
    expect(home.selectedChannel().id).toBe('developer');
  });

  it('rotates the dial pointer through the shortest path', () => {
    const home = create();
    expect(home.dial()).toBe('rotate(0deg)');
    home.chooseCategory('datetime');
    expect(home.dial()).toBe('rotate(-40deg)');
    home.chooseCategory('developer');
    expect(home.dial()).toBe('rotate(0deg)');
  });
});
