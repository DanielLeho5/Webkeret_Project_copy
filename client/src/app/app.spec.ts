import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { ThemeService } from './theme.service';

describe('App', () => {
  let themeServiceMock: { initializeTheme: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    themeServiceMock = {
      initializeTheme: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        { provide: ThemeService, useValue: themeServiceMock }
      ]
    }).compileComponents();
  });

  it('should initialize theme on startup', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    expect(themeServiceMock.initializeTheme).toHaveBeenCalledTimes(1);
  });
});
